/*
  Warnings:

  - Added the required column `isTemplate` to the `Portfolio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "isTemplate" BOOLEAN NOT NULL;
