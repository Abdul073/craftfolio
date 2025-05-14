import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { techList } from "@/lib/techlist";

interface MessageMemory {
  text: string;
  timestamp: Date;
}

export async function POST(req: NextRequest) {
  try {
    const { portfolioData, inputValue, messageMemory } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Schema for extracting user intentions
    const outputSchema = z.object({
      changes: z
        .array(
          z.object({
            intent: z
              .string()
              .describe(
                "The specific action being requested (add, update, delete, change)"
              ),
            sectionName: z
              .string()
              .describe("The specific section of the portfolio being modified"),
            value: z.string().describe("The exact new value to be applied"),
            isNewRequest: z
              .boolean()
              .describe(
                "Whether this is a new request or a reference to a previous message"
              ),
          })
        )
        .describe("Array of distinct changes requested by the user"),
    });

    const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);
    const formatInstructions = outputParser.getFormatInstructions();

    // Format message memory for context - only include the last 3 messages for efficiency
    const recentMemory =
      messageMemory?.length > 0
        ? messageMemory
            .slice(-3)
            .map(
              (msg: MessageMemory, index: number) =>
                `Message ${index + 1}: ${msg.text}`
            )
            .join("\n")
        : "";

    const getIntention = PromptTemplate.fromTemplate(`
      You are a portfolio customization assistant analyzing a user request.
      
      # CONTEXT
      Previous messages (only consider these if directly referenced):
      ${recentMemory}
      
      # CURRENT REQUEST
      "{input_value}"

      # PORTFOLIO DATA
      {portfolioData}

      # INSTRUCTIONS
      1. Identify ONLY the specific changes requested in the CURRENT message
      2. For each change, determine if it's a new request or refers to a previous message
      3. Do NOT repeat actions from previous messages unless explicitly requested again
      4. If the user says "make it shorter" or similar, mark isNewRequest as false
      
      # PARSING RULES
      - Extract specific values when provided (e.g., "change name to John Smith" → value: "John Smith")
      - For vague requests (e.g., "improve my summary"), set isNewRequest: true but leave value empty
      - Each change must have a precise intent (add, update, remove, change) and clear sectionName
      - Do NOT infer additional changes beyond what's explicitly requested
      - If the user mentions multiple sections, create separate change objects for each
      
      {format_instructions}
      
      Before responding, validate your JSON output has valid syntax.
    `);

    const finalIntention = await getIntention.format({
      input_value: inputValue,
      portfolioData: JSON.stringify(portfolioData, null, 2),
      format_instructions: formatInstructions,
    });

    const parsedResponse = await model.generateContent(finalIntention);
    const parsedText = parsedResponse.response.text();

    // Add error handling for parsing - extract JSON properly
    let parsedOutput;
    try {
      // Attempt to find and parse JSON from the response
      const jsonRegex = /```(?:json)?\s*([\s\S]*?)```|(\{[\s\S]*\})/;
      const match = parsedText.match(jsonRegex);

      const jsonContent = match ? match[1] || match[2] : parsedText;
      parsedOutput = await outputParser.parse(jsonContent.trim());

      // Validate the output structure
      if (!parsedOutput.changes || !Array.isArray(parsedOutput.changes)) {
        throw new Error("Invalid output structure");
      }
    } catch (error) {
      console.error("Parsing error:", error);
      return NextResponse.json(
        {
          error:
            "Failed to understand your request. Please try again with more specific instructions.",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 400 }
      );
    }

    // Filter out changes that refer to previous requests but don't have specific values
    const validChanges = parsedOutput.changes.filter(
      (change) =>
        change.isNewRequest || (change.value && change.value.trim() !== "")
    );

    // Starting with the original portfolio data
    let currentPortfolioData = JSON.parse(JSON.stringify(portfolioData));
    const appliedChanges = [];

    // Process each change sequentially
    for (const change of validChanges) {
      // For new requests without specific values, generate appropriate content
      if (
        change.isNewRequest &&
        (!change.value || change.value.trim() === "")
      ) {
        const contentGeneratorPrompt = PromptTemplate.fromTemplate(`
          Generate appropriate content for a portfolio update.
          
          # TASK
          Generate content for: {intent} in section {sectionName}
          
          # CURRENT PORTFOLIO DATA
          {portfolioData}
          
          # INSTRUCTIONS
          1. Generate ONLY the specific content needed, nothing more
          2. Be professional and authentic - never use placeholders
          3. Match the style and tone of existing content
          4. Be concise but complete
          5. For tech stack, ONLY use technologies from this list: {tech_list}
          
          # RESPONSE FORMAT
          Return ONLY the generated content as plain text, no explanations or formatting.
        `);

        const contentPrompt = await contentGeneratorPrompt.format({
          intent: change.intent,
          sectionName: change.sectionName,
          portfolioData: JSON.stringify(currentPortfolioData, null, 2),
          tech_list: JSON.stringify(techList),
        });

        const contentResponse = await model.generateContent(contentPrompt);
        change.value = contentResponse.response.text().trim();
      }

      const updatePortfolioTemplate = PromptTemplate.fromTemplate(`
        You are a specialized portfolio data updater that ONLY modifies JSON data.
        
        # TASK
        Make exactly ONE change to the portfolio data based on:
        - Intent: {intent}
        - Section: {sectionName}
        - Value: {value}
        
        # CURRENT PORTFOLIO DATA
        {portfolioData}
        
        # RULES
        1. ONLY modify the specified section
        2. Preserve all other data exactly as is
        3. For projects or experience, use this image URL: {image_link}
        4. For tech stack, only use technologies from: {tech_list}
        5. Generate distinct content for summary (2-3 lines) and shortSummary (1 line) fields
        6. Never use placeholders like "[Your text here]" or "Example project"
        
        # IMPORTANT
        Return ONLY the complete modified JSON data without any explanations, markdown, or code blocks.
      `);

      const updatePrompt = await updatePortfolioTemplate.format({
        portfolioData: JSON.stringify(currentPortfolioData, null, 2),
        intent: change.intent,
        sectionName: change.sectionName,
        value: change.value,
        image_link: "https://placehold.co/600x400?text=Project+Image",
        tech_list: JSON.stringify(techList),
      });

      const updatedResponse = await model.generateContent(updatePrompt);
      const updatedText = updatedResponse.response.text();

      try {
        // Handle potential code blocks or raw JSON in the response
        const cleanJson = updatedText
          .replace(/```(?:json)?\s*([\s\S]*?)```/g, "$1")
          .trim();
        currentPortfolioData = JSON.parse(cleanJson);
        appliedChanges.push(change);
      } catch (error) {
        console.error("Error parsing updated portfolio data:", error);
        // Continue with other changes if possible instead of failing completely
      }
    }

    // Generate a concise, specific response
    const userResponseTemplate = PromptTemplate.fromTemplate(`
      You are responding to a portfolio update request.
      
      # USER REQUEST
      "{input_value}"
      
      # CHANGES APPLIED
      {changes}
      
      # INSTRUCTIONS
      1. Write a short, specific response (2-3 sentences max)
      2. Mention exactly what was changed in which sections
      3. Be conversational and helpful
      4. DO NOT describe changes that weren't made
      5. NEVER use generic phrases like "as requested" or "I've updated your portfolio"
      
      Write ONLY your response message, nothing else:
    `);

    const changesFormatted = appliedChanges
      .map((change) => `- ${change.intent} in ${change.sectionName}`)
      .join("\n");

    const userResponsePrompt = await userResponseTemplate.format({
      input_value: inputValue,
      changes: changesFormatted || "No changes were applied",
    });

    const userResponseResult = await model.generateContent(userResponsePrompt);
    const userResponse = userResponseResult.response.text();

    return NextResponse.json({
      originalData: portfolioData,
      updatedData: currentPortfolioData,
      changes: appliedChanges,
      userReply: userResponse,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "An error occurred during portfolio customization",
        details: error instanceof Error ? error.message : String(error),
        userReply:
          "I couldn't process your request due to a technical issue. Please try again with more specific instructions about what you'd like to change in your portfolio.",
      },
      { status: 500 }
    );
  }
}
