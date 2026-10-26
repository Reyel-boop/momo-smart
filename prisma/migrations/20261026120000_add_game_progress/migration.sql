-- CreateTable
CREATE TABLE "GameProgress" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "game" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameProgress_studentId_game_idx" ON "GameProgress"("studentId", "game");

-- CreateIndex
CREATE UNIQUE INDEX "GameProgress_studentId_levelId_key" ON "GameProgress"("studentId", "levelId");

-- AddForeignKey
ALTER TABLE "GameProgress" ADD CONSTRAINT "GameProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

