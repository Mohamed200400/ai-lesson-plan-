/*
  Warnings:

  - Changed the type of `pedagogicalApproach` on the `LessonPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LessonPlan" DROP COLUMN "pedagogicalApproach",
ADD COLUMN     "pedagogicalApproach" TEXT NOT NULL;
