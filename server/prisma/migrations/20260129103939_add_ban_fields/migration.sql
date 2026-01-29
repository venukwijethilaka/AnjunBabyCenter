-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banExpiresAt" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT;
