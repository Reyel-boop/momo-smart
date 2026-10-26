-- CreateTable
CREATE TABLE "RaceSession" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RaceSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RaceSession_sectionId_startsAt_idx" ON "RaceSession"("sectionId", "startsAt");

-- AddForeignKey
ALTER TABLE "RaceSession" ADD CONSTRAINT "RaceSession_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

