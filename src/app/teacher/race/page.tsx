import { type Metadata } from "next";

import { PageHeader } from "~/app/_components/page-header";
import { api } from "~/trpc/server";
import { TeacherRace } from "./teacher-race";

export const metadata: Metadata = { title: "Group Race · Momo Smart" };
export const dynamic = "force-dynamic";

/** Group Race: a class split into five teams racing on the stars they earn. */
export default async function GroupRacePage() {
  const classes = await api.race.classes();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Group Race"
        subtitle="Each class is split into 5 teams. Every star a student earns in the class — correct Unit Questions and Live Quiz answers, graded work, and course games — moves their team's car forward. Show it on the projector to cheer the teams on."
      />
      <TeacherRace classes={classes} />
    </div>
  );
}
