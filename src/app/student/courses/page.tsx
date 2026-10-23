import { TRPCError } from "@trpc/server";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChevronRightIcon } from "~/app/_components/icons";
import { Card, EmptyState } from "~/app/_components/ui";
import { teacherFullName } from "~/app/student/_components/format";
import { youTubeId } from "~/lib/video";
import { api } from "~/trpc/server";
import type { RouterOutputs } from "~/trpc/react";
import { CoursesOverview } from "./_components/courses-overview";
import { InstructorCard } from "./_components/instructor-card";
import { LecturePlayer } from "./_components/lecture-player";
import { LessonContent } from "./_components/lesson-content";
import { LessonHeader, LockedLesson } from "./_components/lesson-header";
import { UnitPlan } from "./_components/unit-plan";
import {
  AllUnits,
  UnitQuestionsCallout,
} from "./_components/unit-questions-links";
import { YouTubeLecture } from "./_components/youtube-lecture";

export const metadata: Metadata = { title: "Courses · Momo Smart" };

/** Progress and notes change as the student works, so never cache. */
export const dynamic = "force-dynamic";

type Sections = RouterOutputs["course"]["mySections"];
type SearchParams = Record<string, string | string[] | undefined>;

const param = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function StudentCourses({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const requestedCourse = param(params.course) ?? null;
  const requestedLesson = param(params.lesson) ?? null;
  const sections = await api.course.mySections();

  // Plain /student/courses (sidebar, breadcrumb, "View All") lists every
  // course; a course or lesson in the URL opens a lesson.
  if (!requestedCourse && !requestedLesson) {
    return <CoursesOverview sections={sections} />;
  }

  const lessonId =
    requestedLesson ?? (await pickLesson(requestedCourse, sections));
  const lesson = lessonId ? await loadLesson(lessonId) : null;
  const activeCourseId =
    lesson?.unit.course.id ?? requestedCourse ?? sections[0]?.course.id;

  if (!lesson) {
    return (
      <div className="mx-auto max-w-[1400px] space-y-5">
        <CourseSwitcher sections={sections} activeCourseId={activeCourseId} />
        <Card>
          <EmptyState>
            {sections.length === 0
              ? "You are not enrolled in any courses this term."
              : "No lessons have been published for this course yet."}
          </EmptyState>
        </Card>
      </div>
    );
  }

  const section =
    sections.find((s) => s.course.id === lesson.unit.course.id) ?? null;
  const [viewers, officeHours, sectionWork, units, unitQuizzes] =
    await Promise.all([
      api.lesson.liveViewerCount({ lessonId: lesson.id }),
      section
        ? api.calendar.officeHours({ teacherId: section.teacher.id })
        : Promise.resolve([]),
      section
        ? api.assignment.listForSection({ sectionId: section.id })
        : Promise.resolve([]),
      api.course.syllabus({ courseId: lesson.unit.course.id }),
      api.assessment.unitQuizzes({ courseId: lesson.unit.course.id }),
    ]);
  const unitQuiz = unitQuizzes.find((quiz) => quiz.unitId === lesson.unit.id);
  const unitWork = sectionWork.filter(
    (work) => work.unit?.id === lesson.unit.id,
  );
  const now = new Date();
  const lessonNumber = `${lesson.unit.order}.${lesson.order}`;
  const teacher = section ? teacherFullName(section.teacher.user) : null;
  const lectureHeading = `${lesson.unit.course.name} · Lesson ${lessonNumber}: ${lesson.title}`;
  const lectureBadge = section
    ? `Lecture • ${section.teacher.user.name?.split(" ").slice(-1)[0] ?? "Instructor"}`
    : "Lecture";
  const youTubeVideo = youTubeId(lesson.videoUrl);

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <nav aria-label="Breadcrumb">
        <ol className="text-muted flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <li>
            <Link href="/student/courses" className="hover:text-ink">
              Courses
            </Link>
          </li>
          <Crumb>
            <Link
              href={`/student/courses?course=${lesson.unit.course.id}`}
              className="hover:text-ink"
            >
              {lesson.unit.course.name}
              {section && ` (Period ${section.period})`}
              {teacher && ` – ${teacher}`}
            </Link>
          </Crumb>
          <Crumb>{lesson.unit.title}</Crumb>
          <Crumb>
            <span className="text-brand" aria-current="page">
              Lesson {lessonNumber}
            </span>
          </Crumb>
        </ol>
      </nav>

      <CourseSwitcher sections={sections} activeCourseId={activeCourseId} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <LessonHeader lesson={lesson} section={section} />
          {lesson.isLocked ? (
            <LockedLesson lesson={lesson} />
          ) : (
            <>
              {youTubeVideo ? (
                <YouTubeLecture
                  key={lesson.id}
                  lessonId={lesson.id}
                  videoId={youTubeVideo}
                  heading={lectureHeading}
                  badge={lectureBadge}
                  startAt={lesson.myProgress?.positionSeconds ?? 0}
                  markers={lesson.markers}
                  notes={lesson.myNotes}
                  viewers={viewers}
                />
              ) : (
                <LecturePlayer
                  key={lesson.id}
                  lessonId={lesson.id}
                  heading={lectureHeading}
                  badge={lectureBadge}
                  videoUrl={lesson.videoUrl}
                  transcriptUrl={lesson.transcriptUrl}
                  durationSeconds={lesson.videoDurationSeconds}
                  startAt={lesson.myProgress?.positionSeconds ?? 0}
                  markers={lesson.markers}
                  notes={lesson.myNotes}
                  viewers={viewers}
                />
              )}
              <LessonContent lesson={lesson} />
              {unitQuiz && (
                <UnitQuestionsCallout
                  unitTitle={lesson.unit.title}
                  quiz={unitQuiz}
                />
              )}
            </>
          )}
        </div>

        <div className="min-w-0 space-y-6">
          <UnitPlan lesson={lesson} unitWork={unitWork} now={now} />
          <AllUnits
            units={units}
            quizzes={unitQuizzes}
            currentUnitId={lesson.unit.id}
          />
          {section && (
            <InstructorCard
              section={section}
              officeHours={officeHours}
              now={now}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Crumb({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-1.5">
      <ChevronRightIcon className="size-3.5" />
      {children}
    </li>
  );
}

/** Pill row for moving between the student's enrolled courses. */
function CourseSwitcher({
  sections,
  activeCourseId,
}: {
  sections: Sections;
  activeCourseId: string | undefined;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/student/courses"
        className="border-line bg-surface text-brand hover:bg-canvas inline-flex items-center gap-1 rounded-xl border px-3.5 py-2 text-xs font-bold whitespace-nowrap transition"
      >
        <ChevronRightIcon className="size-3.5 rotate-180" />
        All courses
      </Link>
      {sections.map((section) => {
        const active = section.course.id === activeCourseId;
        return (
          <Link
            key={section.id}
            href={`/student/courses?course=${section.course.id}`}
            aria-current={active ? "page" : undefined}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition ${
              active
                ? "bg-navy text-white"
                : "border-line bg-surface text-ink hover:bg-canvas border"
            }`}
          >
            {section.course.name}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * The lesson to open when none is named: the one the student last worked on,
 * or for a chosen course, its in-progress lesson, else its first unfinished.
 */
async function pickLesson(
  courseId: string | null,
  sections: Sections,
): Promise<string | null> {
  if (!courseId) {
    const resume = await api.lesson.resumePoint();
    if (resume) return resume.lesson.id;
  }

  const targetCourse = courseId ?? sections[0]?.course.id;
  if (!targetCourse) return null;

  const units = await api.course.syllabus({ courseId: targetCourse });
  const lessons = units.flatMap((unit) => unit.lessons);
  const chosen =
    lessons.find((l) => l.myProgress?.status === "IN_PROGRESS") ??
    lessons.find((l) => l.myProgress?.status !== "COMPLETED") ??
    lessons[0];
  return chosen?.id ?? null;
}

/** A missing lesson, or one outside the student's courses, is a 404. */
async function loadLesson(lessonId: string) {
  try {
    return await api.lesson.get({ lessonId });
  } catch (error) {
    if (
      error instanceof TRPCError &&
      (error.code === "NOT_FOUND" || error.code === "FORBIDDEN")
    ) {
      notFound();
    }
    throw error;
  }
}
