/*
  Warnings:

  - The `defaultLevel` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `level` on the `LessonPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LessonPlan" DROP COLUMN "level",
ADD COLUMN     "level" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "defaultLevel",
ADD COLUMN     "defaultLevel" TEXT;

-- DropEnum
DROP TYPE "EducationalLevel";

-- DropEnum
DROP TYPE "PedagogicalApproach";
