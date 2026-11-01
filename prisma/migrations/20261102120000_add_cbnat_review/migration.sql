-- CreateEnum
CREATE TYPE "NatSubject" AS ENUM ('ENGLISH', 'FILIPINO', 'MATH', 'SCIENCE', 'AP', 'MIXED');

-- AlterTable
ALTER TABLE "AssessmentAttempt" ADD COLUMN     "nextQuestionAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "NatTest" (
    "id" TEXT NOT NULL,
    "subject" "NatSubject" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NatTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NatQuestion" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "explanation" TEXT,

    CONSTRAINT "NatQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NatOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NatOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NatAttempt" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "status" "AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "nextQuestionAt" TIMESTAMP(3),
    "score" DOUBLE PRECISION,
    "focusLosses" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "NatAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NatResponse" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionId" TEXT,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NatResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NatTest_subject_title_key" ON "NatTest"("subject", "title");

-- CreateIndex
CREATE UNIQUE INDEX "NatQuestion_testId_order_key" ON "NatQuestion"("testId", "order");

-- CreateIndex
CREATE INDEX "NatAttempt_studentId_status_idx" ON "NatAttempt"("studentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "NatAttempt_testId_studentId_attempt_key" ON "NatAttempt"("testId", "studentId", "attempt");

-- CreateIndex
CREATE UNIQUE INDEX "NatResponse_attemptId_questionId_key" ON "NatResponse"("attemptId", "questionId");

-- AddForeignKey
ALTER TABLE "NatQuestion" ADD CONSTRAINT "NatQuestion_testId_fkey" FOREIGN KEY ("testId") REFERENCES "NatTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NatOption" ADD CONSTRAINT "NatOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "NatQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NatAttempt" ADD CONSTRAINT "NatAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "NatTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NatAttempt" ADD CONSTRAINT "NatAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NatResponse" ADD CONSTRAINT "NatResponse_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "NatAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NatResponse" ADD CONSTRAINT "NatResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "NatQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

