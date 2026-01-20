-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'OWNER';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "canReportIssues" SET DEFAULT true,
ALTER COLUMN "isApproved" SET DEFAULT true;

-- CreateTable
CREATE TABLE "_UserProducts" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserProducts_AB_unique" ON "_UserProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_UserProducts_B_index" ON "_UserProducts"("B");

-- AddForeignKey
ALTER TABLE "_UserProducts" ADD CONSTRAINT "_UserProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserProducts" ADD CONSTRAINT "_UserProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
