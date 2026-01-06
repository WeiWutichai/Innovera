/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "content_th" TEXT,
ADD COLUMN     "excerpt_th" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaDescription_th" TEXT,
ADD COLUMN     "metaKeywords" TEXT,
ADD COLUMN     "metaKeywords_th" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "metaTitle_th" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "title_th" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
