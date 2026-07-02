-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIEVE');

-- CreateEnum
CREATE TYPE "CommnetStatus" AS ENUM ('APPROVED', 'REJECT');

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorid" TEXT NOT NULL,
    "postid" TEXT NOT NULL,
    "status" "CommnetStatus" NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "thumbail" TEXT,
    "isFeature" BOOLEAN NOT NULL DEFAULT false,
    "status" "PostStatus" NOT NULL DEFAULT 'PUBLISHED',
    "tags" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "authorid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "comments_postid_idx" ON "comments"("postid");

-- CreateIndex
CREATE INDEX "comments_authorid_idx" ON "comments"("authorid");

-- CreateIndex
CREATE INDEX "posts_authorid_idx" ON "posts"("authorid");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postid_fkey" FOREIGN KEY ("postid") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
