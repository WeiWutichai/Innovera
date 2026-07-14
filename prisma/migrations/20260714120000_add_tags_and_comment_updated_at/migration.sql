-- Add issue tags (Tag + implicit M2M _IssueTags) and IssueComment.updatedAt.
-- The _ProductLineUsers PK<->unique-index churn that `migrate diff` emits is a
-- known Prisma 5.22 drift with no runtime effect and is intentionally omitted.

-- AlterTable: track last edit time for comments so the UI can show "(edited)".
ALTER TABLE "IssueComment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
-- Existing comments were never edited: align updatedAt with createdAt so they
-- are not falsely flagged as edited.
UPDATE "IssueComment" SET "updatedAt" = "createdAt";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT 'slate',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable (implicit M2M Issue<->Tag; A = Issue, B = Tag)
CREATE TABLE "_IssueTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_IssueTags_AB_unique" ON "_IssueTags"("A", "B");

-- CreateIndex
CREATE INDEX "_IssueTags_B_index" ON "_IssueTags"("B");

-- AddForeignKey
ALTER TABLE "_IssueTags" ADD CONSTRAINT "_IssueTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IssueTags" ADD CONSTRAINT "_IssueTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed the default tag set (reference data; stable ids keep this idempotent).
INSERT INTO "Tag" ("id", "name", "color") VALUES
    ('tag_bug', 'Bug', 'red'),
    ('tag_feature', 'Feature Request', 'violet'),
    ('tag_question', 'Question', 'sky'),
    ('tag_uiux', 'UI/UX', 'pink'),
    ('tag_performance', 'Performance', 'amber'),
    ('tag_documentation', 'Documentation', 'teal')
ON CONFLICT ("name") DO NOTHING;
