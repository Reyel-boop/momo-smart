-- Live, Kahoot-style quiz games hosted by teachers for their classes.
-- CreateEnum
CREATE TYPE "LiveGameStatus" AS ENUM ('LOBBY', 'QUESTION', 'REVEAL', 'FINISHED');

-- CreateTable
CREATE TABLE "LiveGame" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "status" "LiveGameStatus" NOT NULL DEFAULT 'LOBBY',
    "questionIds" TEXT[],
    "currentIndex" INTEGER NOT NULL DEFAULT -1,
    "questionStartedAt" TIMESTAMP(3),
    "secondsPerQuestion" INTEGER NOT NULL DEFAULT 20,
    "teamMode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "LiveGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LivePlayer" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "team" INTEGER,
    "score" INTEGER NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LivePlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveAnswer" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "points" INTEGER NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LiveGame_sectionId_status_idx" ON "LiveGame"("sectionId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "LivePlayer_gameId_studentId_key" ON "LivePlayer"("gameId", "studentId");

-- CreateIndex
CREATE INDEX "LiveAnswer_gameId_questionId_idx" ON "LiveAnswer"("gameId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "LiveAnswer_playerId_questionId_key" ON "LiveAnswer"("playerId", "questionId");

-- AddForeignKey
ALTER TABLE "LiveGame" ADD CONSTRAINT "LiveGame_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveGame" ADD CONSTRAINT "LiveGame_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "TeacherProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveGame" ADD CONSTRAINT "LiveGame_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LivePlayer" ADD CONSTRAINT "LivePlayer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "LiveGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LivePlayer" ADD CONSTRAINT "LivePlayer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveAnswer" ADD CONSTRAINT "LiveAnswer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "LiveGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveAnswer" ADD CONSTRAINT "LiveAnswer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "LivePlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
