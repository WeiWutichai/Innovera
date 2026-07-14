-- Add priority, ticketNumber, dueDate to Issue.
--
-- Hand-written instead of `migrate dev` output for one reason: existing rows
-- must receive ticket numbers in createdAt order. A plain `SERIAL` column
-- backfills in physical row order, which is not guaranteed to match creation
-- date. So the column is added nullable, backfilled with ROW_NUMBER() ordered
-- by createdAt, then given the sequence default + NOT NULL + UNIQUE — the end
-- state is identical to what Prisma generates for
-- `ticketNumber Int @unique @default(autoincrement())` (SERIAL), including the
-- sequence name and ownership, so no schema drift is introduced.

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "ticketNumber" INTEGER;

-- Backfill existing issues in creation order (id as tie-breaker).
UPDATE "Issue"
SET "ticketNumber" = sub.rn
FROM (
    SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt" ASC, "id" ASC) AS rn
    FROM "Issue"
) sub
WHERE "Issue"."id" = sub."id";

-- Sequence for future inserts, starting after the backfilled maximum.
CREATE SEQUENCE "Issue_ticketNumber_seq";
SELECT setval('"Issue_ticketNumber_seq"', COALESCE(MAX("ticketNumber"), 0) + 1, false) FROM "Issue";

ALTER TABLE "Issue" ALTER COLUMN "ticketNumber" SET NOT NULL;
ALTER TABLE "Issue" ALTER COLUMN "ticketNumber" SET DEFAULT nextval('"Issue_ticketNumber_seq"');
ALTER SEQUENCE "Issue_ticketNumber_seq" OWNED BY "Issue"."ticketNumber";

-- CreateIndex
CREATE UNIQUE INDEX "Issue_ticketNumber_key" ON "Issue"("ticketNumber");
