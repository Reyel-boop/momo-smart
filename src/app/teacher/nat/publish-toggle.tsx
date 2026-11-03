"use client";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

/** Opens a CB-NAT test to students, or hides it again. */
export function PublishToggle({
  testId,
  published,
  aiAnswers,
}: {
  testId: string;
  published: boolean;
  /** Whether the answer key may need checking first. */
  aiAnswers?: boolean;
}) {
  const router = useRouter();
  const setPublished = api.nat.setPublished.useMutation({
    onSuccess: () => router.refresh(),
  });
  return (
    <button
      type="button"
      disabled={setPublished.isPending}
      onClick={() => {
        if (
          !published &&
          aiAnswers &&
          !window.confirm(
            "Open this test to students? Make sure the answer key has been checked first.",
          )
        ) {
          return;
        }
        setPublished.mutate({ testId, published: !published });
      }}
      className={`rounded-lg px-3 py-1.5 text-xs font-bold disabled:opacity-50 ${
        published
          ? "border-line text-ink hover:bg-canvas border"
          : "bg-brand text-white hover:opacity-90"
      }`}
    >
      {setPublished.isPending
        ? "Saving…"
        : published
          ? "Hide from students"
          : "Open to students"}
    </button>
  );
}
