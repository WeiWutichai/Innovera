-- Threaded replies: IssueComment can reference a parent comment.
-- The _ProductLineUsers PK<->unique-index churn `migrate diff` emits is a known
-- Prisma 5.22 drift with no runtime effect and is intentionally omitted.

-- AlterTable
ALTER TABLE "IssueComment" ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "IssueComment_parentId_idx" ON "IssueComment"("parentId");

-- AddForeignKey (replies cascade-delete with their parent)
ALTER TABLE "IssueComment" ADD CONSTRAINT "IssueComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "IssueComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
