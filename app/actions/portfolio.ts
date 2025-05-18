"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { maps } from "@/lib/templateThemeMaps";

export async function createPortfolio(userId: string, templateName: string, creationMethod: string, customBodyResume: string) {
  try {
    const template = await prisma.template.findFirst({
      where: {
        name: templateName,
      },
      select: { defaultContent: true }
    });

    if (!template || !template.defaultContent) {
      return { success: false, error: "Template not found" };
    }

    let content : any;

    if (creationMethod === "import" && customBodyResume) {
      const templateContent : any = typeof template.defaultContent === 'string' 
        ? JSON.parse(template.defaultContent) 
        : template.defaultContent;
      
      const customContent : any = JSON.parse(customBodyResume);
      const customSectionMap : any = {};
      if (customContent.sections && Array.isArray(customContent.sections)) {
        customContent.sections.forEach((section : any) => {
          if (section.type) {
            customSectionMap[section.type] = section;
          }
        });
      }
      
      const newContent = {
        ...templateContent,
        sections: templateContent.sections.map((section : any) => {
          return customSectionMap[section.type] || section;
        })
      };

      
      content = newContent;
    } else {
      content = template.defaultContent;
    }

    const newTemplate = await prisma.portfolio.create({
      data: {
        isTemplate: false,
        userId: userId,
        content: content,
        isPublished: false,
        templateName: templateName,
        fontName : maps[templateName].fontName,
        themeName : maps[templateName].themeName
      },
    });

    revalidatePath("/portfolio");
    return { success: true, data: newTemplate };
  } catch (error) {
    console.error("Failed to create portfolio:", error);
    return { success: false, error: "Failed to create portfolio" };
  }
}

export async function updateSection({
  sectionName,
  portfolioId,
  sectionContent,
}: {
  sectionName: string;
  portfolioId: string;
  sectionContent: any;
}) {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    if (!portfolio || !portfolio.content) {
      return { success: false, error: "Portfolio not found" };
    }
    const allSections = (portfolio.content as { sections: any }).sections;
    const portfolioSection = allSections.find(
      (section: any) => section.type === sectionName
    );
    if (!portfolioSection) {
      return { success: false, error: `${sectionName} section not found}` };
    }
    const updatedContent = {
      sections: allSections.map((section: any) => {
        if (section.type === sectionName) {
          return { type: sectionName, data: sectionContent };
        }
        return section;
      }),
    };

    await prisma.portfolio.update({
      where: { id: portfolioId },
      data: { content: updatedContent },
    });

    return { success: true, data: updatedContent };
  } catch (error) {
    console.error("Failed to update hero:", error);
    return { success: false, error: "Failed to update hero" };
  }
}

export async function updatePortfolio({
  portfolioId,
  newPortfolioData
}: {
  portfolioId : string,
  newPortfolioData : string
}){

  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    if (!portfolio || !portfolio.content) {
      return { success: false, error: "Portfolio not found" };
    }
    const updatedData = {
      "sections" : newPortfolioData
    }

    await prisma.portfolio.update({
      where : {id: portfolioId},
      data : {content : updatedData}
    })
    return { success: true, data: updatedData };

  } catch (error) {
    return { success: false, error: "Failed to update hero" };
  }

}

export async function fetchThemesApi(){
  try {
    const themes = await prisma.template.findMany();
    return { success: true, data: themes };
  }catch(error){
    console.error("Error fetching themes:", error);
    return { success: false, error: error };

  }
}

export async function getThemeNameApi({portfolioId} : {portfolioId: string}){
  try {
    const theme = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    return { success: true, data: theme };
  }catch(error){
    console.error("Error fetching themes:", error);
    return { success: false, error: error };

  }
}

export async function fetchContent({ portfolioId }: { portfolioId: string }) {
  try {
    const hero = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    if (!hero || !hero.content) {
      return { success: false, error: "Portfolio not found" };
    }
    return { success: true, data: hero.content };
  } catch (error) {
    console.error("Error fetching content:", error);
    return { success: false, error: error };
  }
}


export async function updateTheme({themeName,portfolioId} : {themeName : string,portfolioId : string}){
  try {
    const theme = await prisma.portfolio.update({
      where : {id: portfolioId},
      data : {themeName : themeName}
    })
    return { success: true, data: theme };
  }catch(error){
    console.error("Error updating theme:", error);
    return { success: false, error: error };
  }
}

export async function updateFont({fontName,portfolioId} : {fontName : string,portfolioId : string}){
  try {
    const theme = await prisma.portfolio.update({
      where : {id: portfolioId},
      data : {fontName : fontName}
    })
    console.log({fontName,theme})
    return { success: true, data: theme };
  }catch(error){
    console.error("Error updating theme:", error);
    return { success: false, error: error };
  }
}

export async function updateCustomCSS({customCSS,portfolioId} : {customCSS : string,portfolioId : string}){
  try {
    const theme = await prisma.portfolio.update({
      where : {id: portfolioId},
      data : {customCSS : customCSS}
    })
    return { success: true, data: theme };
  }catch(error){
    console.error("Error updating theme:", error);
    return { success: false, error: error };
  }
}

export async function fetchPortfoliosByUserId(userId: string) {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // Optional: order by creation date
    });
    return { success: true, data: portfolios };
  } catch (error) {
    console.error("Error fetching portfolios by userId:", error);
    return { success: false, error: "Failed to fetch portfolios" };
  }
}