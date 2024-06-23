/*
  Warnings:

  - Added the required column `gameVersion` to the `drafts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "drafts" ADD COLUMN     "gameVersion" TEXT NOT NULL;
