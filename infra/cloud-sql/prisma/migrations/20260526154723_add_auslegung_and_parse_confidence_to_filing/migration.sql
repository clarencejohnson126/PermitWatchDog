/*
  Warnings:

  - Added the required column `source_type` to the `Filing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Filing" ADD COLUMN     "auslegung_end_date" TIMESTAMP(3),
ADD COLUMN     "parse_confidence" TEXT,
ADD COLUMN     "source_type" TEXT NOT NULL;

ALTER TABLE "Filing" ADD CONSTRAINT source_type_check
  CHECK (source_type IN (
    'bekanntmachung',
    'vergabe',
    'amtsblatt_pdf',
    'bauleitplanung',
    'unknown'
  ));
