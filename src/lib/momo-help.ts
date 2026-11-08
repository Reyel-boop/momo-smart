/**
 * What Momo the help dog knows. Questions are matched to these answers on
 * the device by keywords (English, Filipino and Bisaya), so the chat is free,
 * instant and works without an AI service.
 */

export type HelpRole = "STUDENT" | "TEACHER";

export type HelpEntry = {
  id: string;
  roles: HelpRole[];
  question: string;
  answer: string;
  link?: { label: string; href: string };
  /** Words or phrases that point to this answer. */
  keywords: string[];
};

const S: HelpRole[] = ["STUDENT"];
const T: HelpRole[] = ["TEACHER"];
const BOTH: HelpRole[] = ["STUDENT", "TEACHER"];

export const HELP: HelpEntry[] = [
  // ---- Students -----------------------------------------------------------
  {
    id: "s-submit",
    roles: S,
    question: "How do I submit my assignment?",
    answer:
      "Open Assignments and pick the assignment. Type your answer in the box that says “Type your answer here”, then tap Submit. Adding a file or a link is optional. Not done yet? Tap “Save it for later”.",
    link: { label: "Open Assignments", href: "/student/assignments" },
    keywords: [
      "submit",
      "pass",
      "ipasa",
      "pasa",
      "hand in",
      "answer",
      "sagot",
      "tubag",
      "assignment",
      "homework",
      "output",
      "send",
      "turn in",
    ],
  },
  {
    id: "s-upload",
    roles: S,
    question: "My file won't upload.",
    answer:
      "Files can be PDF, Word, PowerPoint, Excel, a photo (JPG, PNG, HEIC) or text, up to 32 MB. If it still fails, check your internet, or skip the file: just type your answer in the box and submit. That counts too.",
    link: { label: "Open Assignments", href: "/student/assignments" },
    keywords: [
      "upload",
      "file",
      "attach",
      "photo",
      "picture",
      "image",
      "pdf",
      "word",
      "error",
      "failed",
      "cant upload",
      "dili ma upload",
      "hindi ma upload",
      "too big",
      "large",
    ],
  },
  {
    id: "s-edit-submission",
    roles: S,
    question: "Can I change my answer after submitting?",
    answer:
      "After you submit, your work is locked until your teacher checks it. If you made a mistake, message your teacher and ask them to return it to you.",
    link: { label: "Message my teacher", href: "/student/messages" },
    keywords: [
      "change answer",
      "edit",
      "mistake",
      "wrong",
      "resubmit",
      "unsubmit",
      "usab",
      "ilisan",
      "palitan",
      "after submit",
    ],
  },
  {
    id: "s-checked",
    roles: S,
    question: "Has my teacher checked my work?",
    answer:
      "When your teacher checks your work, a green “Your teacher already checked your answer” note shows on Assignments, and the score appears under Completed & Scored with a ✅ Checked by your teacher tag. Work still under Submitted is waiting to be checked.",
    link: {
      label: "See my scores",
      href: "/student/assignments?tab=completed",
    },
    keywords: [
      "checked",
      "check",
      "graded",
      "score",
      "result",
      "na check",
      "gi check",
      "released",
      "waiting",
      "awaiting",
    ],
  },
  {
    id: "s-grades",
    roles: S,
    question: "Where can I see my grades?",
    answer:
      "Open Scores to see your grade in every course, your graded work, your Unit Questions and the stars you have earned.",
    link: { label: "Open Scores", href: "/student/scores" },
    keywords: [
      "grade",
      "grades",
      "grado",
      "marka",
      "score",
      "scores",
      "report card",
      "card",
      "average",
      "points",
    ],
  },
  {
    id: "s-late",
    roles: S,
    question: "Can I still submit late work?",
    answer:
      "If your teacher allows late work, you can still submit after the due date and it is marked Late. If the assignment says “Late work is not accepted” or submissions are closed, message your teacher.",
    link: { label: "Open Assignments", href: "/student/assignments" },
    keywords: [
      "late",
      "overdue",
      "past due",
      "deadline",
      "due",
      "ulahi",
      "huli",
      "missed",
    ],
  },
  {
    id: "s-join",
    roles: S,
    question: "How do I join a class?",
    answer:
      "Open Courses and, under Join a class, type the class code from your teacher, or the course code (for example TLE 10). You can also type a class code when you create your account.",
    link: { label: "Open Courses", href: "/student/courses" },
    keywords: [
      "join",
      "class code",
      "code",
      "enroll",
      "add class",
      "missing class",
      "no class",
      "klase",
      "subject",
    ],
  },
  {
    id: "s-lesson",
    roles: S,
    question: "How do I study a lesson?",
    answer:
      "Open Courses, pick a course and tap Start or Continue. Each lesson has a video, a written lecture, a short reading and a self-check. Tick “Mark as Completed” when you're done.",
    link: { label: "Open Courses", href: "/student/courses" },
    keywords: [
      "lesson",
      "study",
      "lecture",
      "video",
      "module",
      "leksyon",
      "aralin",
      "course",
      "courses",
      "complete",
    ],
  },
  {
    id: "s-unit-questions",
    roles: S,
    question: "How do Unit Questions work?",
    answer:
      "After a unit's lessons, answer its five Unit Questions one at a time. You have 30 seconds for each; when time runs out it counts as wrong. You see the correct answer after each one. You get two tries and your best score counts. Stay on the quiz screen; leaving it is recorded.",
    keywords: [
      "unit questions",
      "quiz",
      "test",
      "exam",
      "timer",
      "30 seconds",
      "time",
      "tries",
      "attempt",
      "pangutana",
      "tanong",
    ],
  },
  {
    id: "s-nat",
    roles: S,
    question: "What is CB-NAT Review?",
    answer:
      "CB-NAT Review is practice for the National Achievement Test, for Grade 10 students only. Each question has 2 minutes. Find it in the menu under CB-NAT Review.",
    link: { label: "Open CB-NAT Review", href: "/student/nat" },
    keywords: [
      "nat",
      "cb-nat",
      "cbnat",
      "national achievement",
      "review",
      "reviewer",
      "grade 10",
    ],
  },
  {
    id: "s-stars",
    roles: S,
    question: "What are stars?",
    answer:
      "You earn 1 star for every point on graded work. Stars unlock rewards, and your rank in your grade level shows on the Dashboard.",
    link: { label: "Open Dashboard", href: "/student" },
    keywords: [
      "star",
      "stars",
      "reward",
      "rewards",
      "rank",
      "points",
      "bituin",
    ],
  },
  {
    id: "s-games",
    roles: S,
    question: "Where are the games?",
    answer:
      "Open Games in the menu. The games you see match your classes, for example the TLE games for Computer Programming or Telecom.",
    link: { label: "Open Games", href: "/student/games" },
    keywords: ["game", "games", "play", "dula", "laro", "turbo", "word hunt"],
  },
  {
    id: "s-live",
    roles: S,
    question: "How do I join a Live Quiz?",
    answer:
      "When your teacher starts a Live Quiz in class, open Live Quiz in the menu. The questions show up on your screen; answer fast to score more.",
    link: { label: "Open Live Quiz", href: "/student/live" },
    keywords: [
      "live",
      "live quiz",
      "kahoot",
      "game pin",
      "pin",
      "quiz in class",
    ],
  },
  {
    id: "s-message",
    roles: S,
    question: "How do I ask my teacher a question?",
    answer: "Open Messages, tap New message and choose your teacher.",
    link: { label: "Open Messages", href: "/student/messages" },
    keywords: [
      "message",
      "chat",
      "ask teacher",
      "contact",
      "teacher",
      "maestra",
      "maestro",
      "magtanong",
      "pangutana sa teacher",
    ],
  },
  {
    id: "s-password",
    roles: S,
    question: "I forgot my password.",
    answer:
      "Ask your teacher, adviser or the school registrar to reset it. They will give you a temporary password, and Momo will ask you to choose a new one. You can change your password any time in Settings.",
    link: { label: "Open Settings", href: "/student/settings" },
    keywords: [
      "password",
      "forgot",
      "nakalimot",
      "nakalimtan",
      "limot",
      "nakalimutan",
      "login",
      "log in",
      "sign in",
      "cant login",
      "account",
      "reset",
    ],
  },
  // ---- Teachers -----------------------------------------------------------
  {
    id: "t-assignment",
    roles: T,
    question: "How do I create an assignment?",
    answer:
      "Open Assignments and press New Assignment. Choose the class, type, points and due date, then publish it so students can see it. Students can always type their answer; a file or link is optional for them.",
    link: { label: "Open Assignments", href: "/teacher/assignments" },
    keywords: [
      "create assignment",
      "new assignment",
      "post assignment",
      "assignment",
      "homework",
      "task",
      "activity",
      "publish",
    ],
  },
  {
    id: "t-edit-assignment",
    roles: T,
    question: "How do I edit an assignment I already posted?",
    answer:
      "Open Assignments, open the assignment and press Edit. You can change the title, instructions, points and dates.",
    link: { label: "Open Assignments", href: "/teacher/assignments" },
    keywords: [
      "edit",
      "change",
      "update",
      "fix",
      "mistake",
      "usab",
      "ilisan",
      "posted",
    ],
  },
  {
    id: "t-who-submitted",
    roles: T,
    question: "Who submitted and who didn't?",
    answer:
      "Open Assignments and open the assignment. It lists Submitted and Not submitted students, and each submitted one is tagged Not checked yet, Graded · not released, or ✓ Released with the score.",
    link: { label: "Open Assignments", href: "/teacher/assignments" },
    keywords: [
      "who submitted",
      "did not submit",
      "didnt submit",
      "not submit",
      "who",
      "submit",
      "submission",
      "submissions",
      "not submitted",
      "missing",
      "submitted",
      "list",
      "pasa",
      "wala nag pasa",
      "hindi nagpasa",
    ],
  },
  {
    id: "t-grade",
    roles: T,
    question: "How do I grade and release scores?",
    answer:
      "Open Grading. “Needs grading” lists work you haven't checked; press Grade Now, enter the score and feedback, and release it. Checked work moves to “✓ Already checked”, where you can view or edit it. Students see a score only once it is released.",
    link: { label: "Open Grading", href: "/teacher/grading" },
    keywords: [
      "grade",
      "grading",
      "check",
      "score",
      "release",
      "queue",
      "mark",
      "checked",
      "feedback",
      "rubric",
    ],
  },
  {
    id: "t-report-card",
    roles: T,
    question: "How do I see a student's report card?",
    answer:
      "Open Grades, choose the section from the dropdown and tap the student's name. The report card follows the DepEd layout: three terms (TLE is one term), final rating, remarks and general average. Press Print to print it.",
    link: { label: "Open Grades", href: "/teacher/grades" },
    keywords: [
      "report card",
      "card",
      "sf9",
      "grade slip",
      "print",
      "general average",
      "final rating",
      "term",
      "deped",
    ],
  },
  {
    id: "t-student-record",
    roles: T,
    question: "Where can I see a student's courses and quizzes?",
    answer:
      "Open Grades and tap “Record” under the student's name, or open the student from your Roster and tap “Courses & quizzes”. It lists every course the student has taken, by school year, with each quiz: Unit Questions, quiz and exam assignments, Live Quizzes and CB-NAT tries, plus their scores.",
    link: { label: "Open Grades", href: "/teacher/grades" },
    keywords: [
      "record",
      "student record",
      "history",
      "courses taken",
      "quizzes",
      "quiz",
      "quiz scores",
      "taken",
      "previous",
      "past",
      "kasaysayan",
    ],
  },
  {
    id: "t-export",
    roles: T,
    question: "How do I export grades?",
    answer:
      "In Grades, choose a section and press Export CSV to download its gradebook for Excel or Google Sheets.",
    link: { label: "Open Grades", href: "/teacher/grades" },
    keywords: ["export", "csv", "excel", "download", "sheets", "gradebook"],
  },
  {
    id: "t-join",
    roles: T,
    question: "How do students join my class?",
    answer:
      "Each class has a class code on your Courses page. Students type it when they create their account, or later with Join a class on their Courses page.",
    link: { label: "Open Courses", href: "/teacher/courses" },
    keywords: [
      "join",
      "class code",
      "code",
      "enroll",
      "add student",
      "students join",
      "roster",
    ],
  },
  {
    id: "t-lecture",
    roles: T,
    question: "How do I add or change a lecture?",
    answer:
      "In Courses, open a unit and press Add lecture (or Edit lecture) under a lesson. Paste a YouTube link or video link and write the lecture text: ## for headings, - for bullet points, **double asterisks** for bold.",
    link: { label: "Open Courses", href: "/teacher/courses" },
    keywords: [
      "lecture",
      "lesson",
      "video",
      "youtube",
      "content",
      "module",
      "add lesson",
    ],
  },
  {
    id: "t-unit-questions",
    roles: T,
    question: "How do Unit Questions work?",
    answer:
      "Students answer five questions per unit, one at a time, with 30 seconds each (CB-NAT Review stays at 2 minutes). They see the correct answer after each one, get two tries, and the best score counts. On Courses, each unit shows its questions, answer key and each section's results.",
    link: { label: "Open Courses", href: "/teacher/courses" },
    keywords: [
      "unit questions",
      "quiz",
      "timer",
      "30 seconds",
      "results",
      "answer key",
      "tries",
    ],
  },
  {
    id: "t-nat",
    roles: T,
    question: "How does CB-NAT Review work?",
    answer:
      "CB-NAT Review is for Grade 10 students only; Grades 7 to 9 don't see it. In the CB-NAT Review tab you can check the tests and answer keys, publish them, and see results. Each question gives students 2 minutes.",
    link: { label: "Open CB-NAT Review", href: "/teacher/nat" },
    keywords: [
      "nat",
      "cb-nat",
      "cbnat",
      "national achievement",
      "review",
      "reviewer",
      "publish test",
    ],
  },
  {
    id: "t-live",
    roles: T,
    question: "How do I run a Live Quiz?",
    answer:
      "Open Live Quiz, choose the class and the questions, and start. Students open Live Quiz on their side and answer as the questions appear.",
    link: { label: "Open Live Quiz", href: "/teacher/live" },
    keywords: ["live", "live quiz", "kahoot", "start quiz", "game", "pin"],
  },
  {
    id: "t-announce",
    roles: T,
    question: "How do I post an announcement?",
    answer:
      "Use Broadcast Announcement on the Dashboard to reach all your classes, or Post Announcement in Course Performance for one class.",
    link: { label: "Open Dashboard", href: "/teacher" },
    keywords: [
      "announcement",
      "announce",
      "broadcast",
      "post",
      "notice",
      "pahibalo",
      "anunsyo",
    ],
  },
  {
    id: "t-message",
    roles: T,
    question: "How do I message a student?",
    answer:
      "Open Messages, press New message and choose the student. You can message anyone on your rosters.",
    link: { label: "Open Messages", href: "/teacher/messages" },
    keywords: [
      "message",
      "chat",
      "contact",
      "student",
      "parent",
      "send message",
    ],
  },
  {
    id: "t-password",
    roles: T,
    question: "A student forgot their password.",
    answer:
      "The school registrar (admin) can reset a student's password and give a temporary one; the student then picks a new one when they sign in. You can change your own password in Settings.",
    link: { label: "Open Settings", href: "/teacher/settings" },
    keywords: [
      "password",
      "forgot",
      "reset",
      "login",
      "log in",
      "sign in",
      "account",
      "nakalimot",
      "nakalimutan",
      "temporary",
    ],
  },
  // ---- Everyone -----------------------------------------------------------
  {
    id: "refresh",
    roles: BOTH,
    question: "The page looks old or a button doesn't work.",
    answer:
      "Refresh the page. On an iPad or phone app, close Momo fully and open it again. When Momo is updated, a “Momo was updated — tap to refresh” button appears at the bottom; tap it.",
    keywords: [
      "refresh",
      "old",
      "not working",
      "button",
      "stuck",
      "error",
      "bug",
      "loading",
      "slow",
      "blank",
      "ipad",
      "update",
      "dili mo gana",
      "ayaw",
      "hindi gumagana",
      "broken",
    ],
  },
  {
    id: "hello",
    roles: BOTH,
    question: "Hi Momo!",
    answer:
      "Arf! 🐶 Hi! I'm Momo. Ask me how to do something in Momo Smart, like “how do I submit?” or “where are my grades?”.",
    keywords: [
      "hi",
      "hello",
      "hey",
      "momo",
      "good morning",
      "maayong buntag",
      "magandang umaga",
      "kumusta",
      "kamusta",
    ],
  },
  {
    id: "thanks",
    roles: BOTH,
    question: "Thank you!",
    answer: "You're welcome! 🐾 Ask me anytime.",
    keywords: ["thanks", "thank you", "salamat", "ty"],
  },
];

const STOP = new Set(
  "a an the i my me to do how what where when can is are it of in on for and or ko ang sa ng nga unsaon paano asa saan ba na mo ka kay".split(
    " ",
  ),
);

const normalize = (text: string) =>
  ` ${text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;

const stem = (word: string) => word.replace(/(ing|ed|es|s)$/, "");

/** The best answers for a question, best first; empty when nothing fits. */
export function findAnswers(question: string, role: HelpRole): HelpEntry[] {
  const text = normalize(question);
  const words = text
    .trim()
    .split(" ")
    .filter((w) => w && !STOP.has(w))
    .map(stem);
  if (words.length === 0) return [];

  const scored = HELP.filter((entry) => entry.roles.includes(role)).map(
    (entry) => {
      let score = 0;
      for (const keyword of entry.keywords) {
        const k = normalize(keyword);
        if (text.includes(k)) {
          // Phrases are stronger signals than single words.
          score += k.trim().includes(" ") ? 4 : 3;
        } else {
          const kw = stem(k.trim());
          if (!kw.includes(" ") && kw.length > 3 && words.includes(kw)) {
            score += 2;
          }
        }
      }
      const q = normalize(entry.question)
        .trim()
        .split(" ")
        .filter((w) => w && !STOP.has(w))
        .map(stem);
      for (const w of words) if (w.length > 2 && q.includes(w)) score += 1;
      return { entry, score };
    },
  );

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0]?.score ?? 0;
  if (best < 3) return [];
  return scored
    .filter((s) => s.score >= Math.max(3, best - 1))
    .slice(0, 2)
    .map((s) => s.entry);
}

/** Starter questions shown when the chat opens. */
export const STARTERS: Record<HelpRole, string[]> = {
  STUDENT: ["s-submit", "s-checked", "s-grades", "s-password"],
  TEACHER: ["t-grade", "t-report-card", "t-who-submitted", "t-assignment"],
};
