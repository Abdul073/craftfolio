import { GoogleGenerativeAI } from "@google/generative-ai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { techList } from "@/lib/techlist";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

// main prompt.
const parsingTemplate = PromptTemplate.fromTemplate(`
You are a professional resume parser. Given an image of a resume, extract the relevant information into a structured JSON format.
Pay attention to all sections: personal information, summary, experience, education, skills, projects, and certifications.
For dates, use MM/YYYY format when possible.
For tech stack item refer to the provided tech list. This list contains most of the possible tech stacks. 
If the project uses any of these tech stacks then use the same name and image present in this array else use name present in resume. 
Handle slightly different names like a resume may contain React and the array may contain React.js so use what is there in the array with its image.
If image not present use any dummy image.

For description projects, experience or any other kind of description summarize it in 3-4 lines at max. A user may have explained about the project in 10-12 lines so summarize it in around 3-4 lines.

Return ONLY valid JSON, without any markdown code blocks, backticks, or explanatory text. The response should be directly parseable as JSON.

Use this exact schema:
{{
  "personalInfo": {{
    "name": string,
    "email": string,
    "phone": string,
    "linkedin": string,
    "github": string (optional),
    "website": string (optional),
    "location": string (optional)
  }},
  "summary": string (optional),
  "experience": [
    {{
      "role": string,
      "companyName": string,
      "location": string (optional),
      "startDate": string,
      "endDate": string,
      "description": string,
      "techStack": [
        {{
          "name": string,
          "logo": string
        }}
      ]
    }}
  ],
  "education": [
    {{
      "degree": string,
      "institution": string,
      "location": string (optional),
      "startDate": string (optional),
      "endDate": string (optional),
      "description": string (optional)
    }}
  ],
  "skills": [
    {{
      "name": string,
      "logo": string
    }}
  ],
  "projects": [
    {{
      "projectName": string,
      "projectTitle": string (optional),
      "projectDescription": string,
      "githubLink": string (optional),
      "liveLink": string (optional),
      "techStack": [
        {{
          "name": string,
          "logo": string
        }}
      ]
    }}
  ],
  "certifications": [
    {{
      "name": string,
      "issuer": string (optional),
      "date": string (optional),
      "url": string (optional)
    }}
  ]
}}

Resume content:
{resume_content}
`);

// title generator
const titleGeneratorTemplate = PromptTemplate.fromTemplate(`
Based on the resume data below, generate a professional title prefix and title suffix options.
Extract the most prominent expertise area for the title prefix (e.g., "Frontend", "Full Stack", "Machine Learning").
Generate 2-3 suffix options (e.g., "Engineer", "Developer", "Architect").

Resume data:
{resume_data}

Return ONLY valid JSON in this format without any explanations:
{{
  "titlePrefix": string,
  "titleSuffixOptions": string[]
}}
`);

// summary generator
const summaryGeneratorTemplate = PromptTemplate.fromTemplate(`
Based on the resume data below, generate 1 concise and professional summary line.
Each line should be a separate sentence highlighting key strengths, skills, or career objectives.
Make it personal and engaging, representing the individual's professional identity.


Eg 1: Enthusiastic and results-driven web developer passionate about building innovative and scalable web applications using modern technologies like React.js, Node.js, and the MERN stack.
Eg 2 : Craving to build innovative solutions that make an impact. Enthusiastic problem solver, always curious about new technologies. Committed to continuous learning and growth.


Resume data:
{resume_data}

Return ONLY valid JSON in this format without any explanations:
{{
  "summaryLines": string[]
}}
`);

// Main post function
export async function POST(req: Request) {
  try {
    const { base64 } = await req.json();
    const filePart = fileToGenerativePart(base64);
    
    // Extract text content from resume image
    const extractionPrompt = "Extract all text content from this resume image.";
    const extractedContent = await model.generateContent([extractionPrompt, filePart]);
    const resumeContent = extractedContent.response.text();
    
    // Parse resume data with LangChain
    const outputParser = new StringOutputParser();
    
    // Use a direct approach with Gemini instead of template if issues persist
    const formattedPrompt = await parsingTemplate.format({
      resume_content: resumeContent
    });
    
    const parsingResponse = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: formattedPrompt }] }],
      generationConfig: {
        temperature: 0.1,
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
    
    // Generate title prefix and suffix options using direct approach
    const titlePrompt = await titleGeneratorTemplate.format({
      resume_data: JSON.stringify(resumeData)
    });
    
    const titleResponse = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: titlePrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });
    
    const titleData = titleResponse.response.text();
    
    // Generate summary lines using direct approach
    const summaryPrompt = await summaryGeneratorTemplate.format({
      resume_data: JSON.stringify(resumeData)
    });
    
    const summaryResponse = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: summaryPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });
    
    const summaryData = summaryResponse.response.text();
    
    // Parse title and summary data
    const titleInfo = JSON.parse(cleanJsonOutput(titleData));
    const summaryInfo = JSON.parse(cleanJsonOutput(summaryData));
    
    // Process and map tech stack with techList
    resumeData = mapTechStackWithTechList(resumeData);
    
    // Convert to portfolio format with enhanced data
    const portfolioData = convertToPortfolioFormat(resumeData, titleInfo, summaryInfo);
    
    return new Response(JSON.stringify(portfolioData), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error processing resume:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to process resume", 
      message: error instanceof Error ? error.message : String(error)
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// file split
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

// cleaning json
function cleanJsonOutput(text: string): string {
  let cleaned = text.replace(/```json\n|\n```|```\n|\n```/g, '');
  const jsonPattern = /\{[\s\S]*\}/;
  const matches = cleaned.match(jsonPattern);
  
  if (matches && matches[0]) {
    return matches[0];
  }
  
  return cleaned;
}

// fix tech stack logos
function mapTechStackWithTechList(resumeData : any) {
  // Create a map of techList items for quick lookup
  const techMap = new Map();
  techList.forEach(tech => {
    // Store in lowercase for case-insensitive matching
    techMap.set(tech.name.toLowerCase(), tech);
  });
  
  // Helper function to update tech stack items
  const updateTechStack = (techItems) => {
    if (!techItems || !Array.isArray(techItems)) return [];
    
    return techItems.map(tech => {
      const techName = tech.name;
      if (!techName) return tech;
      
      // Check if this tech exists in our techList (case insensitive)
      const matchedTech = techMap.get(techName.toLowerCase()) || 
                          Array.from(techMap.values()).find(t => 
                            t.name.toLowerCase().includes(techName.toLowerCase()) || 
                            techName.toLowerCase().includes(t.name.toLowerCase())
                          );
      
      if (matchedTech) {
        return {
          name: matchedTech.name, // Use the standardized name
          logo: matchedTech.logo  // Use the logo from techList
        };
      }
      
      return tech; // Keep original if no match found
    });
  };
  
  // Update skills
  if (resumeData.skills && Array.isArray(resumeData.skills)) {
    resumeData.skills = updateTechStack(resumeData.skills);
  }
  
  // Update experience tech stacks
  if (resumeData.experience && Array.isArray(resumeData.experience)) {
    resumeData.experience.forEach(exp => {
      if (exp.techStack) {
        exp.techStack = updateTechStack(exp.techStack);
      }
    });
  }
  
  // Update project tech stacks
  if (resumeData.projects && Array.isArray(resumeData.projects)) {
    resumeData.projects.forEach(project => {
      if (project.techStack) {
        project.techStack = updateTechStack(project.techStack);
      }
    });
  }
  
  return resumeData;
}

// convert data to proper format
function convertToPortfolioFormat(resumeData : any, titleInfo : any, summaryInfo : any) {
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
    
    // Use generated summary lines or fall back to alternatives
    let summaryLines;
    if (summaryInfo && summaryInfo.summaryLines && summaryInfo.summaryLines.length > 0) {
      summaryLines = summaryInfo.summaryLines.join("\n");
    } else if (resumeData.summary) {
      summaryLines = resumeData.summary.split(". ").slice(0, 3).join(".\n");
    } else {
      // Generate fallback summary based on skills
      const skillNames = resumeData.skills ? resumeData.skills.map(s => s.name).slice(0, 3) : [];
      const primarySkill = skillNames[0] || "Software";
      summaryLines = `Passionate ${primarySkill} developer.\nEnthusiastic about creating innovative solutions.\nDedicated to continuous learning and growth.`;
    }
    
    // Use generated title info or fallback
    const titlePrefix = titleInfo?.titlePrefix || "Software";
    const titleSuffixOptions = titleInfo?.titleSuffixOptions || ["Engineer", "Developer"];
    
    sections.push({
      type: "hero",
      data: {
        name: name,
        titlePrefix: titlePrefix,
        titleSuffixOptions: titleSuffixOptions,
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
      techStack: project.techStack || [],
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
  
  // Education Section
  if (resumeData.education && resumeData.education.length > 0) {
    sections.push({
      type: "education",
      data: resumeData.education
    });
  }
  
  // Certifications Section (if available)
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    sections.push({
      type: "certifications",
      data: resumeData.certifications
    });
  }
  
  return { sections };
}