import { CALL_LEVELS } from "~/lib/games/call-sim";
import { CODE_LEVELS } from "~/lib/games/code-quest";
import { z } from "zod";

import {
  createTRPCRouter,
  studentProcedure,
  teacherProcedure,
} from "~/server/api/trpc";
import { dayOfWeekOf, toDateOnly, weekOfTerm } from "~/server/lib/dates";
import { computeGpa, distributionOf, round } from "~/server/lib/grading";
import {
  gameStarLedger,
  questionStarLedger,
  rewardProgress,
  STAR_ASSIGNMENT_TYPES,
  starsFor,
  starTotals,
} from "~/server/lib/stars";

export const dashboardRouter = createTRPCRouter({
  /**
   * Teacher Command Center header: enrolment, grading backlog, attendance and
   * at-risk counts across every section the teacher owns this term.
   */
  teacherOverview: teacherProcedure.query(async ({ ctx }) => {
    const sectionScope =
      ctx.session.user.role === "ADMIN"
        ? {}
        : { teacherId: ctx.teacherId ?? "" };
    const today = toDateOnly(new Date());
    const soon = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const [
      term,
      sectionCount,
      enrolledCount,
      ungraded,
      ungradedSoon,
      attendanceRows,
      atRisk,
      pendingSessions,
    ] = await Promise.all([
      ctx.db.term.findFirst({
        where: { isCurrent: true },
        select: {
          id: true,
          name: true,
          schoolYear: true,
          startDate: true,
          endDate: true,
        },
      }),
      ctx.db.section.count({ where: sectionScope }),
      ctx.db.enrollment.count({
        where: { status: "ACTIVE", section: sectionScope },
      }),
      ctx.db.submission.count({
        where: {
          status: "SUBMITTED",
          OR: [
            { grade: null },
            { grade: { status: { in: ["PENDING", "IN_PROGRESS"] } } },
          ],
          assignment: { section: sectionScope },
        },
      }),
      ctx.db.submission.count({
        where: {
          status: "SUBMITTED",
          OR: [
            { grade: null },
            { grade: { status: { in: ["PENDING", "IN_PROGRESS"] } } },
          ],
          assignment: { section: sectionScope, dueAt: { lte: soon } },
        },
      }),
      ctx.db.attendanceRecord.groupBy({
        by: ["status"],
        where: { session: { date: today, section: sectionScope } },
        _count: { _all: true },
      }),
      ctx.db.alert.count({
        where: { status: "OPEN", section: sectionScope },
      }),
      ctx.db.attendanceSession.count({
        where: {
          date: today,
          status: { not: "SUBMITTED" },
          section: sectionScope,
        },
      }),
    ]);

    const counts = Object.fromEntries(
      attendanceRows.map((row) => [row.status, row._count._all]),
    ) as Record<string, number>;
    const marked = Object.values(counts).reduce((sum, n) => sum + n, 0);
    const present =
      (counts.PRESENT ?? 0) + (counts.REMOTE ?? 0) + (counts.TARDY ?? 0);

    return {
      term: term
        ? { ...term, week: weekOfTerm(term.startDate, new Date()) }
        : null,
      totalEnrolled: enrolledCount,
      sectionCount,
      ungradedCount: ungraded,
      ungradedDueWithin24h: ungradedSoon,
      attendanceRate: marked > 0 ? round((present / marked) * 100) : null,
      excusedToday: counts.EXCUSED ?? 0,
      atRiskCount: atRisk,
      attendancePending: pendingSessions,
    };
  }),

  /**
   * Per-section performance cards: class average, letter and the A/B/C/D-F
   * distribution used by the bar charts.
   */
  sectionPerformance: teacherProcedure
    .input(z.object({ termId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const termId =
        input?.termId ??
        (
          await ctx.db.term.findFirst({
            where: { isCurrent: true },
            select: { id: true },
          })
        )?.id;
      if (!termId) return [];

      const sections = await ctx.db.section.findMany({
        where: {
          termId,
          ...(ctx.session.user.role === "ADMIN"
            ? {}
            : { teacherId: ctx.teacherId ?? "" }),
        },
        orderBy: { period: "asc" },
        select: {
          id: true,
          code: true,
          period: true,
          course: {
            select: {
              id: true,
              name: true,
              code: true,
              level: true,
              colorToken: true,
            },
          },
          enrollments: {
            where: { status: "ACTIVE" },
            select: { currentPercent: true },
          },
          pacing: { select: { status: true } },
          _count: { select: { enrollments: { where: { status: "ACTIVE" } } } },
        },
      });

      // The unit currently in progress doubles as the syllabus label.
      const currentUnits = await ctx.db.sectionPacing.findMany({
        where: {
          sectionId: { in: sections.map((s) => s.id) },
          status: "IN_PROGRESS",
        },
        select: {
          sectionId: true,
          unit: { select: { order: true, title: true } },
        },
      });
      const unitBySection = new Map(
        currentUnits.map((row) => [row.sectionId, row.unit]),
      );

      return sections.map((section) => {
        const percents = section.enrollments
          .map((e) => e.currentPercent)
          .filter((p): p is number => p !== null);
        const average =
          percents.length > 0
            ? round(percents.reduce((sum, p) => sum + p, 0) / percents.length)
            : null;

        return {
          sectionId: section.id,
          sectionCode: section.code,
          period: section.period,
          course: section.course,
          studentCount: section._count.enrollments,
          classAverage: average,
          distribution: distributionOf(percents),
          gradedStudents: percents.length,
          currentUnit: unitBySection.get(section.id) ?? null,
        };
      });
    }),

  /** Curriculum pacing across the term — "7 of 10 Modules • 70%". */
  pacingSummary: teacherProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.sectionPacing.groupBy({
      by: ["status"],
      where: {
        section:
          ctx.session.user.role === "ADMIN"
            ? {}
            : { teacherId: ctx.teacherId ?? "" },
      },
      _count: { _all: true },
    });

    const counts = Object.fromEntries(
      rows.map((row) => [row.status, row._count._all]),
    ) as Record<string, number>;
    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
    const completed = counts.COMPLETED ?? 0;

    return {
      completedModules: completed,
      totalModules: total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }),

  /** Today's office hours plus how many students have reserved a slot. */
  officeHoursToday: teacherProcedure.query(async ({ ctx }) => {
    if (!ctx.teacherId) return [];
    const now = new Date();

    return ctx.db.officeHour.findMany({
      where: { teacherId: ctx.teacherId, dayOfWeek: dayOfWeekOf(now) },
      orderBy: { startTime: "asc" },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        mode: true,
        location: true,
        meetingUrl: true,
        capacity: true,
        label: true,
        _count: {
          select: {
            bookings: { where: { date: toDateOnly(now), status: "RESERVED" } },
          },
        },
      },
    });
  }),

  /**
   * Student dashboard header: GPA, attendance standing and the day's remaining
   * classes.
   */
  studentOverview: studentProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const today = toDateOnly(now);

    const [profile, term, attendanceRows, gpa] = await Promise.all([
      ctx.db.studentProfile.findUniqueOrThrow({
        where: { id: ctx.studentId },
        select: {
          id: true,
          studentNumber: true,
          gradeLevel: true,
          cumulativeGpa: true,
          gpaPercentile: true,
          user: { select: { name: true, image: true } },
        },
      }),
      ctx.db.term.findFirst({
        where: { isCurrent: true },
        select: { id: true, name: true, startDate: true },
      }),
      ctx.db.attendanceRecord.groupBy({
        by: ["status"],
        where: { studentId: ctx.studentId },
        _count: { _all: true },
      }),
      computeGpa(ctx.db, ctx.studentId),
    ]);

    const counts = Object.fromEntries(
      attendanceRows.map((row) => [row.status, row._count._all]),
    ) as Record<string, number>;
    const totalDays = Object.values(counts).reduce((sum, n) => sum + n, 0);
    const present = (counts.PRESENT ?? 0) + (counts.REMOTE ?? 0);

    // Classes still ahead today, by period.
    const meetings = await ctx.db.sectionMeeting.findMany({
      where: {
        dayOfWeek: dayOfWeekOf(now),
        section: {
          termId: term?.id,
          enrollments: { some: { studentId: ctx.studentId, status: "ACTIVE" } },
        },
      },
      orderBy: { startTime: "asc" },
      select: {
        startTime: true,
        endTime: true,
        room: true,
        section: {
          select: {
            id: true,
            code: true,
            period: true,
            room: true,
            course: { select: { name: true, code: true } },
          },
        },
      },
    });

    const nowLabel = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;
    const remaining = meetings.filter((m) => m.endTime >= nowLabel);

    const [openAlerts, pendingSubmissions] = await Promise.all([
      ctx.db.alert.count({
        where: {
          studentId: ctx.studentId,
          status: { in: ["OPEN", "ACKNOWLEDGED"] },
        },
      }),
      ctx.db.submission.count({
        where: { studentId: ctx.studentId, status: "MISSING" },
      }),
    ]);

    return {
      profile,
      term,
      gpa: gpa ?? profile.cumulativeGpa,
      gpaPercentile: profile.gpaPercentile,
      attendance: {
        present,
        excused: counts.EXCUSED ?? 0,
        tardy: counts.TARDY ?? 0,
        absent: counts.ABSENT ?? 0,
        totalDays,
        rate: totalDays > 0 ? round((present / totalDays) * 100) : null,
        inGoodStanding: (counts.ABSENT ?? 0) === 0,
      },
      classesRemainingToday: remaining.length,
      nextClass: remaining[0] ?? null,
      todayDate: today,
      openAlerts,
      missingWork: pendingSubmissions,
    };
  }),

  /**
   * Star Points accumulator: one star per point on released quiz and test
   * grades, the recent ledger, reward progress, and the student's rank among
   * their grade-level peers.
   */
  studentStars: studentProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.studentProfile.findUniqueOrThrow({
      where: { id: ctx.studentId },
      select: { gradeLevel: true },
    });

    const [mine, cohort, cohortSize, totals, questionLedger, gameLedger] =
      await Promise.all([
        ctx.db.grade.findMany({
          where: {
            status: "RELEASED",
            submission: {
              studentId: ctx.studentId,
              assignment: { type: { in: STAR_ASSIGNMENT_TYPES } },
            },
          },
          orderBy: { releasedAt: "desc" },
          select: {
            id: true,
            score: true,
            releasedAt: true,
            submission: {
              select: {
                assignment: {
                  select: {
                    title: true,
                    type: true,
                    pointsPossible: true,
                    section: { select: { course: { select: { name: true } } } },
                  },
                },
              },
            },
          },
        }),
        ctx.db.studentProfile.findMany({
          where: { gradeLevel: profile.gradeLevel, user: { isActive: true } },
          select: { id: true },
        }),
        ctx.db.studentProfile.count({
          where: { gradeLevel: profile.gradeLevel, user: { isActive: true } },
        }),
        starTotals(ctx.db),
        questionStarLedger(ctx.db, ctx.studentId),
        gameStarLedger(ctx.db, ctx.studentId),
      ]);

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let tests = 0;
    let coursework = 0;
    let thisWeek = 0;
    for (const grade of mine) {
      const stars = starsFor(grade.score);
      if (grade.submission.assignment.type === "EXAM") tests += stars;
      else coursework += stars;
      if (grade.releasedAt && grade.releasedAt.getTime() >= weekAgo) {
        thisWeek += stars;
      }
    }
    // One star per Unit Question answered correctly (each question once).
    let questions = 0;
    for (const entry of questionLedger) {
      questions += entry.stars;
      if (entry.answeredAt && entry.answeredAt.getTime() >= weekAgo) {
        thisWeek += entry.stars;
      }
    }
    // Up to three stars per game level (best result counts).
    let games = 0;
    for (const entry of gameLedger) {
      games += entry.stars;
      if (entry.playedAt && entry.playedAt.getTime() >= weekAgo) {
        thisWeek += entry.stars;
      }
    }
    const total = tests + coursework + questions + games;

    // Rank is one more than the number of grade-mates who have out-earned us.
    const ahead = cohort.filter(
      (peer) => (totals.get(peer.id)?.total ?? 0) > total,
    ).length;

    // Every star-earning grade and set of Unit Questions, newest first
    // ("Full Ledger" on Scores).
    const ledger = [
      ...mine.map((grade) => {
        const { assignment } = grade.submission;
        const score = grade.score ?? 0;
        return {
          id: grade.id,
          title: assignment.title,
          courseName: assignment.section.course.name,
          type: assignment.type,
          releasedAt: grade.releasedAt,
          score,
          pointsPossible: assignment.pointsPossible,
          stars: starsFor(score),
          isPerfect: score >= assignment.pointsPossible,
        };
      }),
      ...questionLedger.map((entry) => ({
        id: entry.id,
        title: entry.title,
        courseName: entry.courseName,
        type: "UNIT_QUESTIONS",
        releasedAt: entry.answeredAt,
        score: entry.stars,
        pointsPossible: entry.totalPoints,
        stars: entry.stars,
        isPerfect: entry.stars >= entry.totalPoints,
      })),
      ...gameLedger.map((entry) => {
        const max =
          (entry.game === "code" ? CODE_LEVELS : CALL_LEVELS).length * 3;
        return {
          id: `game-${entry.game}`,
          title: entry.game === "code" ? "Code Quest" : "Call Simulator",
          courseName:
            entry.game === "code"
              ? "Computer Programming"
              : "Telecommunications",
          type: "GAME",
          releasedAt: entry.playedAt,
          score: entry.stars,
          pointsPossible: max,
          stars: entry.stars,
          isPerfect: entry.stars >= max,
        };
      }),
    ].sort(
      (a, b) => (b.releasedAt?.getTime() ?? 0) - (a.releasedAt?.getTime() ?? 0),
    );

    return {
      total,
      tests,
      coursework,
      questions,
      games,
      thisWeek,
      gradeLevel: profile.gradeLevel,
      rank: ahead + 1,
      cohortSize,
      ...rewardProgress(total),
      recent: ledger.slice(0, 3),
      ledger,
    };
  }),

  /**
   * The star leaderboard: every active student ranked by stars — the whole
   * school, the viewer's grade, or the viewer's section. Ties share a rank.
   * Returns the top 50 and, if lower, the viewer's own row.
   */
  leaderboard: studentProcedure
    .input(z.object({ scope: z.enum(["all", "grade", "section"]) }))
    .query(async ({ ctx, input }) => {
      const me = await ctx.db.studentProfile.findUniqueOrThrow({
        where: { id: ctx.studentId },
        select: {
          gradeLevel: true,
          section: { select: { id: true, name: true } },
        },
      });
      const [students, totals] = await Promise.all([
        ctx.db.studentProfile.findMany({
          where: {
            user: { isActive: true },
            ...(input.scope === "grade" ? { gradeLevel: me.gradeLevel } : {}),
            ...(input.scope === "section"
              ? { sectionId: me.section?.id ?? "-" }
              : {}),
          },
          select: {
            id: true,
            gradeLevel: true,
            section: { select: { name: true } },
            user: { select: { name: true } },
          },
        }),
        starTotals(ctx.db),
      ]);

      const rows = students
        .map((s) => {
          const t = totals.get(s.id);
          return {
            studentId: s.id,
            name: s.user.name ?? "Student",
            gradeLevel: s.gradeLevel,
            section: s.section?.name ?? null,
            stars: t?.total ?? 0,
            questionStars: t?.questions ?? 0,
            gradedStars: t?.graded ?? 0,
            gameStars: t?.games ?? 0,
            isMe: s.id === ctx.studentId,
          };
        })
        .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
      // Standard competition ranking: 1, 2, 2, 4…
      const ranked = rows.map((row, index) => ({
        ...row,
        rank:
          index > 0 && rows[index - 1]!.stars === row.stars
            ? rows.findIndex((r) => r.stars === row.stars) + 1
            : index + 1,
      }));
      const top = ranked.slice(0, 50);
      const mine = ranked.find((r) => r.isMe);
      return {
        scope: input.scope,
        gradeLevel: me.gradeLevel,
        section: me.section?.name ?? null,
        count: ranked.length,
        top,
        me: mine && !top.some((r) => r.isMe) ? mine : null,
        myRank: mine?.rank ?? null,
        myStars: mine?.stars ?? 0,
      };
    }),

  /** Recomputes and caches the student's GPA after grades change. */
  refreshGpa: studentProcedure.mutation(async ({ ctx }) => {
    const gpa = await computeGpa(ctx.db, ctx.studentId);
    await ctx.db.studentProfile.update({
      where: { id: ctx.studentId },
      data: { cumulativeGpa: gpa },
    });
    return { gpa };
  }),
});
