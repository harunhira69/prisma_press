/*
  Warnings:

  - You are about to drop the column `isFeature` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `thumbail` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "isFeature",
DROP COLUMN "thumbail",
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "thumbnail" TEXT;
