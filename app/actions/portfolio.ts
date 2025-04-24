"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {templates} from "@/lib/templateContent";

export async function createPortfolio(userId: string, templateName: string) {
  try {
    const newTemplate = await prisma.portfolio.create({
      data: {
        isTemplate: false,
        userId: userId,
        content: templates[templateName],
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

export async function fetchContent({
  portfolioId,
}: {
  portfolioId: string;

}){
  try {
    console.log(portfolioId)
    const hero = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    if (!hero || !hero.content) {
      return { success: false, error: "Portfolio not found" };
    }

    return { success: true, data: hero.content };
  } catch (error) {
    return { success: false,error : error };
  }
}
