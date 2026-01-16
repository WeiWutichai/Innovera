-- AlterTable
ALTER TABLE "ChatSession" ADD COLUMN     "adminTookOver" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastAdminReplyAt" TIMESTAMP(3);
