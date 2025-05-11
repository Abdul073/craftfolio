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

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { portfolioData, inputValue, messageMemory } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Updated schema to handle multiple changes at once
    const outputSchema = z.object({
      changes: z
        .array(
          z.object({
            intent: z
              .string()
              .describe(
                "The type of change requested (e.g., change_color, update_text)"
              ),
            sectionName: z
              .string()
              .describe("The section of the portfolio being modified"),
            value: z.string().describe("The new value to be applied"),
          })
        )
        .describe("Array of all changes requested by the user"),
    });

    const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);
    const formatInstructions = outputParser.getFormatInstructions();

    // Format message memory for context
    const messageContext = messageMemory?.length > 0 
      ? `Previous messages for context:\n${messageMemory.map((msg: MessageMemory, index: number) => 
          `${index + 1}. ${msg.text}`
        ).join('\n')}\n\n`
      : '';

    const getIntention = PromptTemplate.fromTemplate(`
      You are a portfolio customization assistant.
      Your job is to analyze the user's request, which may contain multiple changes, and extract all requested modifications.
      
      ${messageContext}
      Current request: {input_value} 
      
      This is the data: {portfolioData}

      IMPORTANT: 
      - The user may request MULTIPLE changes in a single message. You need to identify ALL requested changes.
      - Consider the context from previous messages when interpreting the current request.
      - If the user refers to a previous change (e.g., "shorten it more"), use the context to understand what they're referring to.
      - For example, if they previously asked to "shorten my summary" and now say "shorten it more", you should understand they want to further shorten the same summary.
      
      Make sure to scan the data properly since fields can be present in multiple sections (e.g., name can be in both hero and userInfo).
      
      If the user provides a specific change value (like "change my name to John Smith"), use exactly that value.
      If the user requests a change but doesn't provide a specific value (like "shorten my summary"), you must come up with a complete and appropriate value based on the existing portfolio data.
      
      {format_instructions}
    `);

    const finalIntention = await getIntention.format({
      input_value: inputValue,
      portfolioData: JSON.stringify(portfolioData),
      format_instructions: formatInstructions,
    });

    const parsedResponse = await model.generateContent(finalIntention);
    const parsedText = parsedResponse.response.text();

    const parsedOutput = await outputParser.parse(parsedText);

    // Starting with the original portfolio data
    let currentPortfolioData = JSON.parse(JSON.stringify(portfolioData));

    // Apply each change sequentially
    for (const change of parsedOutput.changes) {
      const updatePortfolioTemplate = PromptTemplate.fromTemplate(`
        You are a portfolio data updater with expertise in professional portfolio content.
        Your job is to modify the portfolio data based on the user's intent.
        
        Current portfolio data: {portfolioData}
        
        Intent details:
        - Intent: {intent}
        - Section: {sectionName}
        - Value: {value}
        
        IMPORTANT: 
        - NEVER use placeholders like "[Your text here]", "More detailed summary text here", or "Example project" in your output
        - NEVER generate content that says "placeholder" or similar terms
        - ALWAYS generate realistic, professional content that matches the style and tone of the existing portfolio
        - When generating content, consider the context of the entire portfolio to maintain consistency
        - If you need to generate new content, make it detailed and specific, not generic
        - Always generate two different summaries for summary field and shortSummary field. shortSummary will be like 1 line and summary will be around 2-3 lines.
        
        Instructions:
        1. Modify the provided portfolio data based on the intent and section
        2. Return ONLY the updated portfolio data as a valid JSON array
        3. Do not add any explanation, just return the JSON
        4. When adding new projects or experience, give proper detailed descriptions that sound authentic and match the portfolio owner's background
        5. For projects use this image {image_link}
        6. When adding tech stack anywhere search in this list and only include tech stack that are present in this list {tech_list}
      `);

      const updatePrompt = await updatePortfolioTemplate.format({
        portfolioData: JSON.stringify(currentPortfolioData),
        intent: change.intent,
        sectionName: change.sectionName,
        value: change.value,
        image_link: "https://placehold.co/600x400?text=Project+Image",
        tech_list: JSON.stringify(techList),
      });

      const updatedResponse = await model.generateContent(updatePrompt);
      const updatedText = updatedResponse.response.text();

      try {
        // Handle potential code blocks in the response
        const jsonMatch = updatedText.match(/```json\n([\s\S]*?)\n```/) ||
          updatedText.match(/```\n([\s\S]*?)\n```/) || [null, updatedText];

        const jsonString = jsonMatch[1] || updatedText;
        currentPortfolioData = JSON.parse(jsonString.trim());
      } catch (error) {
        console.error("Error parsing updated portfolio data:", error);
        return NextResponse.json(
          {
            error: "Failed to parse updated portfolio data",
            rawResponse: updatedText,
          },
          { status: 500 }
        );
      }
    }

    // Generate user response template
    const userResponseTemplate = PromptTemplate.fromTemplate(`
      You are a helpful portfolio assistant responding to a user request.
      
      User request: {input_value}
      
      Your task is to generate a friendly, concise response confirming what you've updated in their portfolio.
      
      Changes made:
      {changes}
      
      Write a brief, conversational response (2-3 sentences) confirming what you've updated.
      Be specific about what was changed and in which sections.
      Sound helpful and positive.
      
      IMPORTANT: Your response should:
      - Mention specific changes that were made (not just "updated as requested")
      - Sound natural and conversational, not robotic
      - Not include placeholders or generic statements like "I've updated your [section]"
      - Focus on what was actually changed
      
      Response:
    `);

    const changesFormatted = parsedOutput.changes
      .map(
        (change) =>
          `- Updated ${change.sectionName}: ${change.intent} with value "${change.value}"`
      )
      .join("\n");

    const userResponsePrompt = await userResponseTemplate.format({
      input_value: inputValue,
      changes: changesFormatted,
    });

    const userResponseResult = await model.generateContent(userResponsePrompt);
    const userResponse = userResponseResult.response.text();

    return NextResponse.json({
      originalData: portfolioData,
      updatedData: currentPortfolioData,
      changes: parsedOutput.changes,
      userReply: userResponse,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "An error occurred during portfolio customization",
        details: error instanceof Error ? error.message : String(error),
        userReply:
          "I'm sorry, but I encountered an error while trying to update your portfolio. Please try again or provide more specific instructions.",
      },
      { status: 500 }
    );
  }
}