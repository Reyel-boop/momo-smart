import { type Metadata } from "next";

import { PageHeader } from "~/app/_components/page-header";
import { StudentRace } from "./student-race";

export const metadata: Metadata = { title: "Group Race · Momo Smart" };
export const dynamic = "force-dynamic";

/** The student's Group Races: one per class, with their own team marked. */
export default function StudentRacePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Group Race"
        subtitle="Your class is split into 5 teams. Every star you earn in the class — correct Unit Questions and Live Quiz answers, graded work, and course games — pushes your team's car forward."
      />
      <StudentRace />
    </div>
  );
}
