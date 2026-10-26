-- CreateTable
CREATE TABLE "RaceTeam" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RaceTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaceMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "RaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RaceTeam_sectionId_number_key" ON "RaceTeam"("sectionId", "number");

-- CreateIndex
CREATE INDEX "RaceMember_teamId_idx" ON "RaceMember"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "RaceMember_sectionId_studentId_key" ON "RaceMember"("sectionId", "studentId");

-- AddForeignKey
ALTER TABLE "RaceTeam" ADD CONSTRAINT "RaceTeam_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaceMember" ADD CONSTRAINT "RaceMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "RaceTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaceMember" ADD CONSTRAINT "RaceMember_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

