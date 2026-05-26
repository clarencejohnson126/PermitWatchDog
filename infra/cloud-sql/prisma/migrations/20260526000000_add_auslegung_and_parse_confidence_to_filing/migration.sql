/*
  Warnings:
  - Added the required column `source_type` to the `Filing` table without a default value. This is not possible if the table is not empty.
*/
-- AlterTable
ALTER TABLE "Filing" ADD COLUMN "auslegung_end_date" TIMESTAMP(3);
ALTER TABLE "Filing" ADD COLUMN "parse_confidence" TEXT;
ALTER TABLE "Filing" ADD COLUMN "source_type" TEXT NOT NULL DEFAULT 'unknown';
