'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPortfolio(userId: string, templateName: string) {
  try {
    const newTemplate = await prisma.portfolio.create({
      data: {
        isTemplate: false,
        userId: userId,
        content: "",
        isPublished: false,
        templateName: templateName
      },
    });
    
    revalidatePath('/portfolio');
    return { success: true, data: newTemplate };
  } catch (error) {
    console.error("Failed to create portfolio:", error);
    return { success: false, error: "Failed to create portfolio" };
  }
}