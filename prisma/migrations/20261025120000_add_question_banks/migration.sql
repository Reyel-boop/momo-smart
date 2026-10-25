-- Live Quiz question banks: extra questions per unit, beyond the Unit Questions.
-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "bankForUnitId" TEXT;

-- CreateIndex
CREATE INDEX "Assessment_bankForUnitId_idx" ON "Assessment"("bankForUnitId");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_bankForUnitId_fkey" FOREIGN KEY ("bankForUnitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
