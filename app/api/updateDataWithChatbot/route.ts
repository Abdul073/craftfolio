import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { techList } from "@/lib/techlist";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { portfolioData, inputValue } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const outputSchema = z.object({
      intent: z.string().describe("The type of change requested (e.g., change_color, update_text)"),
      sectionName: z.string().describe("The section of the portfolio being modified"),
      value: z.string().describe("The new value to be applied")
    });

    const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);

    const formatInstructions = outputParser.getFormatInstructions();

    const getIntention = PromptTemplate.fromTemplate(`
      You are a portfolio customization assistant.
      Your job is to classify the user's request into an intent category and extract key details if needed.
      
      This is the input: {input_value} 
      
      This is the data: {portfolioData}

      Make sure to scan the data properly since the field can be present in multiple sections for eg name can be in both hero and userInfo so make sure to consider that.
      
      {format_instructions}
    `);

    const finalIntention = await getIntention.format({
      input_value: inputValue,
      portfolioData: JSON.stringify(portfolioData),
      format_instructions: formatInstructions
    });
    
    const parsedResponse = await model.generateContent(finalIntention);
    const parsedText = parsedResponse.response.text();
    
    const parsedOutput = await outputParser.parse(parsedText);
    
    // Generate user response template
    const userResponseTemplate = PromptTemplate.fromTemplate(`
      You are a helpful portfolio assistant responding to a user request.
      
      User request: {input_value}
      
      Your task is to generate a friendly, concise response confirming what you've updated in their portfolio.
      
      Intent details:
      - Intent: {intent}
      - Section: {sectionName}
      - Value: {value}
      
      Write a brief, conversational response (2-3 sentences max) confirming what you've updated.
      Be specific about what was changed and in which section.
      Sound helpful and positive.
      
      Response:
    `);

    const userResponsePrompt = await userResponseTemplate.format({
      input_value: inputValue,
      intent: parsedOutput.intent,
      sectionName: parsedOutput.sectionName,
      value: parsedOutput.value
    });
    
    const userResponseResult = await model.generateContent(userResponsePrompt);
    const userResponse = userResponseResult.response.text();
    
    const updatePortfolioTemplate = PromptTemplate.fromTemplate(`
      You are a portfolio data updater.
      Your job is to modify the portfolio data based on the user's intent.
      
      Original portfolio data: {portfolioData}
      
      Intent details:
      - Intent: {intent}
      - Section: {sectionName}
      - Value: {value}
      
      Instructions:
      1. Make a deep copy of the original portfolio data
      2. Find the section that needs to be updated
      3. Update the appropriate field based on the intent and section
      4. Return ONLY the updated portfolio data as a valid JSON array
      5. Do not add any explanation, just return the JSON
      6. When adding new projects or experience give proper descriptionns to them. for projects use this image {image_link}
      7. When adding tech stack anywhere search in this list and only include tech stack that are present in this list {tech_list}
    `);

    const updatePrompt = await updatePortfolioTemplate.format({
      portfolioData: JSON.stringify(portfolioData),
      intent: parsedOutput.intent,
      sectionName: parsedOutput.sectionName,
      value: parsedOutput.value,
      image_link: "https://placehold.co/600x400?text=Project+Image",
      tech_list: JSON.stringify(techList)
    });
    
    const updatedResponse = await model.generateContent(updatePrompt);
    const updatedText = updatedResponse.response.text();
    
    // Parse the updated portfolio data
    let updatedPortfolioData;
    try {
      // Handle potential code blocks in the response
      const jsonMatch = updatedText.match(/```json\n([\s\S]*?)\n```/) || 
                         updatedText.match(/```\n([\s\S]*?)\n```/) ||
                         [null, updatedText];
      
      const jsonString = jsonMatch[1] || updatedText;
      updatedPortfolioData = JSON.parse(jsonString.trim());
    } catch (error) {
      console.error("Error parsing updated portfolio data:", error);
      return NextResponse.json({
        error: "Failed to parse updated portfolio data",
        rawResponse: updatedText
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      originalData: portfolioData,
      updatedData: updatedPortfolioData,
      changes: {
        intent: parsedOutput.intent,
        section: parsedOutput.sectionName,
        value: parsedOutput.value
      },
      userReply: userResponse
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: "An error occurred during portfolio customization",
      details: error instanceof Error ? error.message : String(error),
      userReply: "I'm sorry, but I encountered an error while trying to update your portfolio. Please try again or provide more specific instructions."
    }, { status: 500 });
  }
}