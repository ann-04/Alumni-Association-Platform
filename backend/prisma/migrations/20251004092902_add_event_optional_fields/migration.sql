-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "contactEmail" VARCHAR(200),
ADD COLUMN     "eligibility" TEXT,
ADD COLUMN     "entryFee" TEXT,
ADD COLUMN     "maxParticipants" INTEGER,
ADD COLUMN     "tags" TEXT,
ADD COLUMN     "time" VARCHAR(50);
