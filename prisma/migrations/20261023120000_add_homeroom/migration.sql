-- Sections (homerooms) students belong to, managed by the admin.
CREATE TABLE "Homeroom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gradeLevel" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Homeroom_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Homeroom_gradeLevel_name_key" ON "Homeroom"("gradeLevel", "name");

ALTER TABLE "StudentProfile" ADD COLUMN "sectionId" TEXT;

CREATE INDEX "StudentProfile_sectionId_idx" ON "StudentProfile"("sectionId");

ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Homeroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
