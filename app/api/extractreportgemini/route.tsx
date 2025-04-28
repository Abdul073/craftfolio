import { GoogleGenerativeAI } from "@google/generative-ai";
import { PromptTemplate } from "@langchain/core/prompts";
import { techList } from "@/lib/techlist";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

// Create prompt template with explicit instructions for clean JSON output
const promptTemplate = `
You are a professional resume parser. Given an image of a resume, extract the relevant information into a structured JSON format.
Pay attention to all sections: personal information, summary, experience, education, skills, projects, and certifications.
For dates, use MM/YYYY format when possible.
For tech stack item refer to ${techList}. This list contains most of the possible tech stacks. 
If the project uses any of these tech stacks then use the same name and image present in this array else use name present in resume. 
Handle slightly different names like a resume may contain React and the array may contain React.js so use what is there in the array with its image.
If image not present use any dummy image.

For description projects,experience or any other kind of description summarize it in 3-4lines at max. A user may have explained about the project in 10-12 lines so summarize it in around 3-4 lines.

Return ONLY valid JSON, without any markdown code blocks, backticks, or explanatory text. The response should be directly parseable as JSON.

Use this exact schema:
{
  "personalInfo": {
    "name": string,
    "email": string,
    "phone": string,
    "linkedin": string,
    "github": string (optional),
    "website": string (optional),
    "location": string (optional)
  },
  "summary": string (optional),
  "experience": [
    {
      "role": string,
      "companyName": string,
      "location": string (optional),
      "startDate": string,
      "endDate": string,
      "description": string,
      "techStack": [
        {
    "name": string,
    "logo" : string
    }
      ]
    }
  ],
  "education": [
    {
      "degree": string,
      "institution": string,
      "location": string (optional),
      "startDate": string (optional),
      "endDate": string (optional),
      "description": string (optional)
    }
  ],
  "skills": [{
    "name": string,
    "logo" : string
    }],
  "projects": [
    {
      "projectName": string,
      "projectTitle": string (optional),
      "projectDescription": string,
      "githubLink": string (optional),
      "liveLink": string (optional),
      "techStack": [
      {
    "name": string,
    "logo" : string
    }
      ]
    }
  ],
  "certifications": [
    {
      "name": string,
      "issuer": string (optional),
      "date": string (optional),
      "url": string (optional)
    }
  ]
}

Resume content:
{resume_content}
`;

export async function POST(req: Request) {
  try {
    const { base64 } = await req.json();
    const filePart = fileToGenerativePart(base64);
    
    // Extract raw text from resume image
    const extractionPrompt = "Extract all text content from this resume image.";
    const extractedContent = await model.generateContent([extractionPrompt, filePart]);
    const resumeContent = extractedContent.response.text();
    
    // Get structured data from Gemini with explicit instructions for clean JSON
    const formattedPrompt = promptTemplate.replace("{resume_content}", resumeContent);
    const parsingResponse = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: formattedPrompt }] }],
      generationConfig: {
        temperature: 0.1, // Lower temperature for more deterministic output
        maxOutputTokens: 8192,
      }
    });
    
    const parsedText = parsingResponse.response.text();
    
    // Clean the output to ensure it's valid JSON
    const cleanedJson = cleanJsonOutput(parsedText);
    
    // Validate and parse the JSON
    let resumeData;
    try {
      resumeData = JSON.parse(cleanedJson);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return new Response(JSON.stringify({ 
        error: "Failed to parse resume data",
        raw: cleanedJson
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Convert to portfolio format
    const portfolioData = convertToPortfolioFormat(resumeData);
    
    return new Response(JSON.stringify(portfolioData), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error processing resume:", error);
    return new Response(JSON.stringify({ error: "Failed to process resume" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function fileToGenerativePart(imageData: string) {
  return {
    inlineData: {
      data: imageData.split(",")[1],
      mimeType: imageData.substring(
        imageData.indexOf(":") + 1,
        imageData.lastIndexOf(";")
      ),
    },
  };
}

function cleanJsonOutput(text: string): string {
  // Remove markdown code block formatting if present
  let cleaned = text.replace(/```json\n|\n```|```\n|\n```/g, '');
  
  // Remove any explanatory text before or after the JSON
  // This regex looks for a JSON object pattern and extracts it
  const jsonPattern = /\{[\s\S]*\}/;
  const matches = cleaned.match(jsonPattern);
  
  if (matches && matches[0]) {
    return matches[0];
  }
  
  return cleaned;
}

function convertToPortfolioFormat(resumeData) {
  const sections = [];
  
  // User Info Section
  if (resumeData.personalInfo) {
    sections.push({
      type: "userInfo",
      data: {
        github: resumeData.personalInfo.github || "",
        linkedin: resumeData.personalInfo.linkedin || "",
        email: resumeData.personalInfo.email || "",
      },
    });
  }
  
  // Hero Section
  if (resumeData.personalInfo?.name || resumeData.summary) {
    const name = resumeData.personalInfo?.name || "";
    const summaryLines = resumeData.summary 
      ? resumeData.summary.split(". ").slice(0, 3).join(".\n") 
      : resumeData.personalInfo?.name 
        ? `Passionate ${resumeData.skills?.[0] || "Software"} developer.\nEnthusiastic about creating innovative solutions.\nDedicated to continuous learning and growth.`
        : "";
    
    sections.push({
      type: "hero",
      data: {
        name: name,
        titlePrefix: "Software",
        titleSuffixOptions: ["Engineer", "Developer"],
        subtitle: summaryLines,
        badge: {
          texts: [
            "Open to work",
            "Available for freelance",
            "Let's Collaborate!",
          ],
          color: "green",
          isVisible: true,
        },
        actions: [
          {
            type: "button",
            label: "View Projects",
            url: "#projects",
            style: "primary",
          },
          {
            type: "button",
            label: "Contact Me",
            url: "#contact",
            style: "outline",
          },
        ],
      },
    });
  }
  
  // Projects Section
  if (resumeData.projects && resumeData.projects.length > 0) {
    const formattedProjects = resumeData.projects.map(project => ({
      projectName: project.projectName,
      projectTitle: project.projectTitle || `${project.projectName.split(" ").slice(0, 3).join(" ")}`,
      projectDescription: project.projectDescription,
      githubLink: project.githubLink || "https://github.com/user/project",
      liveLink: project.liveLink || "https://project-demo.vercel.app",
      projectImage: "https://user-images.githubusercontent.com/106135144/196727097-50c0ae49-b92f-4aa9-bdcb-30d978a44125.png", // Default placeholder
      techStack:  project.techStack || [],
    }));
    
    sections.push({
      type: "projects",
      data: formattedProjects
    });
  }
  
  // Experience Section
  if (resumeData.experience && resumeData.experience.length > 0) {
    const formattedExperience = resumeData.experience.map(exp => ({
      role: exp.role,
      companyName: exp.companyName,
      location: exp.location || "Remote",
      startDate: exp.startDate || "01/2023",
      endDate: exp.endDate || "Present",
      description: exp.description,
      techStack: exp.techStack || [],
    }));
    
    sections.push({
      type: "experience",
      data: formattedExperience
    });
  }
  
  // Technologies Section
  if (resumeData.skills && resumeData.skills.length > 0) {
    const techStack = resumeData.skills;
    
    sections.push({
      type: "technologies",
      data: techStack
    });
  }
  
  return { sections };
}