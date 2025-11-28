-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "bannerImage" VARCHAR(500),
ADD COLUMN     "contactInfo" VARCHAR(200),
ADD COLUMN     "duration" VARCHAR(100),
ADD COLUMN     "externalLink" VARCHAR(500),
ADD COLUMN     "registrationLink" VARCHAR(500),
ADD COLUMN     "speakerDetails" TEXT,
ADD COLUMN     "speakerName" VARCHAR(100);
