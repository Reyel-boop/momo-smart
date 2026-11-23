-- CreateTable
CREATE TABLE "SponsorCard" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT,
    "sponsor" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '💡',
    "heading" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "linkUrl" TEXT,
    "linkLabel" TEXT,
    "color" TEXT NOT NULL DEFAULT '#f97316',
    "startsOn" TIMESTAMP(3),
    "endsOn" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsorCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsorStat" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SponsorStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsorSetting" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsorSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SponsorCard_active_idx" ON "SponsorCard"("active");

-- CreateIndex
CREATE UNIQUE INDEX "SponsorStat_cardId_month_key" ON "SponsorStat"("cardId", "month");

-- AddForeignKey
ALTER TABLE "SponsorStat" ADD CONSTRAINT "SponsorStat_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "SponsorCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
