-- AlterTable
ALTER TABLE "DailyTask" ADD COLUMN     "settledAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastSettledDate" DATE,
ADD COLUMN     "pendingAssessment" JSONB;
