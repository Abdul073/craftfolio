"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { templates } from "@/lib/templateContent";

export async function createPortfolio(userId: string, templateName: string, creationMethod: string) {
  try {
    console.log({templateName,userId});
    const template = await prisma.template.findFirst({
      where: {
        name: templateName,
      },
      select: { defaultContent: true }
    })

    if(!template || !template.defaultContent) {
      return { success: false, error: "Template not found" }
    }

    const newTemplate = await prisma.portfolio.create({
      data: {
        isTemplate: false,
        userId: userId,
        content: template?.defaultContent,
        isPublished: false,
        templateName: templateName,
      },
    });

    revalidatePath("/portfolio");
    return { success: true, data: newTemplate };
  } catch (error) {
    console.error("Failed to create portfolio:", error);
    return { success: false, error: "Failed to create portfolio" };
  }
}

export async function updateHero({
  portfolioId,
  content,
}: {
  portfolioId: string;
  content: any;
}) {
  try {
    const hero = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    if (!hero || !hero.content) {
      return { success: false, error: "Portfolio not found" };
    }
    const allSections = (hero.content as { sections: any }).sections;
    const heroSection = allSections.find(
      (section: any) => section.type === "hero"
    );
    if (!heroSection) {
      return { success: false, error: "Hero section not found" };
    }
    const updatedContent = {
      sections: allSections.map((section: any) => {
        if (section.type === "hero") {
          return { type: "hero", data: content };
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

export async function updateProjects({
  portfolioId,
  projects,
}: {
  portfolioId: string;
  projects: any;
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
      (section: any) => section.type === "projects"
    );
    if (!portfolioSection) {
      return { success: false, error: "Hero section not found" };
    }
    const updatedContent = {
      sections: allSections.map((section: any) => {
        if (section.type === "projects") {
          return { type: "projects", data: projects };
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

export async function updateExperience({
  portfolioId,
  experiences,
}: {
  portfolioId: string;
  experiences: any;
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
      (section: any) => section.type === "experience"
    );
    if (!portfolioSection) {
      return { success: false, error: "Experience section not found" };
    }
    const updatedContent = {
      sections: allSections.map((section: any) => {
        if (section.type === "experience") {
          return { type: "experience", data: experiences };
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

export async function updateTechnologies({
  portfolioId,
  selectedTech,
}: {
  portfolioId: string;
  selectedTech: any;
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
      (section: any) => section.type === "technologies"
    );
    if (!portfolioSection) {
      return { success: false, error: "Technology section not found" };
    }
    const updatedContent = {
      sections: allSections.map((section: any) => {
        if (section.type === "technologies") {
          return { type: "technologies", data: selectedTech };
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

export async function fetchThemesApi(){
  try {
    const themes = await prisma.template.findMany();
    console.log(themes)
    return { success: true, data: themes };
  }catch(error){
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
    return { success: false, error: error };

  }
}

export async function fetchContent({ portfolioId }: { portfolioId: string }) {
  try {
    console.log(portfolioId);
    const hero = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    if (!hero || !hero.content) {
      return { success: false, error: "Portfolio not found" };
    }

    return { success: true, data: hero.content };
  } catch (error) {
    return { success: false, error: error };
  }
}
