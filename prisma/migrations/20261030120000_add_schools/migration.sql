-- Schools: people, sections (homerooms), classes and school-wide
-- announcements and events belong to a school. Everything that exists now
-- belongs to San Vicente National High School.

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "depedId" TEXT,
    "address" TEXT,
    "joinCode" TEXT NOT NULL DEFAULT ('S'::text || upper(substr(md5(((random())::text || (clock_timestamp())::text)), 1, 7))),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "School_name_key" ON "School"("name");
CREATE UNIQUE INDEX "School_joinCode_key" ON "School"("joinCode");

INSERT INTO "School" ("id", "name") VALUES ('sch-svnhs', 'San Vicente National High School');

-- People
ALTER TABLE "User" ADD COLUMN "isOwner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "schoolId" TEXT;
UPDATE "User" SET "schoolId" = 'sch-svnhs';
UPDATE "User" SET "isOwner" = true WHERE "email" = 'reyeljimenez555@gmail.com';
CREATE INDEX "User_schoolId_role_idx" ON "User"("schoolId", "role");
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Sections (homerooms)
DROP INDEX "Homeroom_gradeLevel_name_key";
ALTER TABLE "Homeroom" ADD COLUMN "schoolId" TEXT;
UPDATE "Homeroom" SET "schoolId" = 'sch-svnhs';
ALTER TABLE "Homeroom" ALTER COLUMN "schoolId" SET NOT NULL;
CREATE UNIQUE INDEX "Homeroom_schoolId_gradeLevel_name_key" ON "Homeroom"("schoolId", "gradeLevel", "name");
ALTER TABLE "Homeroom" ADD CONSTRAINT "Homeroom_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Classes
DROP INDEX "Section_termId_courseId_code_key";
ALTER TABLE "Section" ADD COLUMN "schoolId" TEXT;
UPDATE "Section" SET "schoolId" = 'sch-svnhs';
ALTER TABLE "Section" ALTER COLUMN "schoolId" SET NOT NULL;
CREATE INDEX "Section_schoolId_termId_idx" ON "Section"("schoolId", "termId");
CREATE UNIQUE INDEX "Section_schoolId_termId_courseId_code_key" ON "Section"("schoolId", "termId", "courseId", "code");
ALTER TABLE "Section" ADD CONSTRAINT "Section_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- School-wide announcements and events
ALTER TABLE "Announcement" ADD COLUMN "schoolId" TEXT;
UPDATE "Announcement" SET "schoolId" = 'sch-svnhs';
CREATE INDEX "Announcement_schoolId_publishedAt_idx" ON "Announcement"("schoolId", "publishedAt");
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CalendarEvent" ADD COLUMN "schoolId" TEXT;
UPDATE "CalendarEvent" SET "schoolId" = 'sch-svnhs';
CREATE INDEX "CalendarEvent_schoolId_startAt_idx" ON "CalendarEvent"("schoolId", "startAt");
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
