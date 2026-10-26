-- CreateTable
CREATE TABLE "QuestAnswer" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestAnswer_questionId_idx" ON "QuestAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestAnswer_studentId_questionId_key" ON "QuestAnswer"("studentId", "questionId");

-- AddForeignKey
ALTER TABLE "QuestAnswer" ADD CONSTRAINT "QuestAnswer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestAnswer" ADD CONSTRAINT "QuestAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

