"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

/** Ask for this account to be deleted, or take the request back. */
export function DeletionRequest({
  name,
  school,
  requestedAt,
  home,
  isOwner,
}: {
  name: string;
  school: string | null;
  requestedAt: Date | null;
  home: string;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const request = api.user.requestDeletion.useMutation({
    onSuccess: () => {
      setConfirming(false);
      router.refresh();
    },
  });

  if (isOwner) {
    return (
      <p className="bg-canvas text-muted rounded-xl p-4 text-sm">
        This is the Momo owner account, which can&apos;t be deleted from here.
      </p>
    );
  }

  if (requestedAt) {
    return (
      <div className="space-y-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-bold">Your request was sent.</p>
        <p>
          You asked on{" "}
          {new Date(requestedAt).toLocaleDateString("en-PH", {
            dateStyle: "long",
          })}
          . {school ? `${school}'s admin` : "Your school admin"} will delete
          your account and data within 30 days. Until then you can still sign
          in.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => request.mutate({ cancel: true })}
            disabled={request.isPending}
            className="border-line bg-surface text-ink rounded-lg border px-3 py-2 text-sm font-bold disabled:opacity-60"
          >
            Keep my account
          </button>
          <Link
            href={home}
            className="bg-navy rounded-lg px-3 py-2 text-sm font-bold text-white"
          >
            Back to Momo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-canvas space-y-3 rounded-xl p-4 text-sm">
      <p className="text-ink">
        Signed in as <b>{name}</b>
        {school ? ` · ${school}` : ""}.
      </p>
      {confirming ? (
        <div className="space-y-2">
          <p className="font-bold text-rose-700">
            Are you sure? Once your school admin deletes it, your work and stars
            can&apos;t be brought back.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => request.mutate({ cancel: false })}
              disabled={request.isPending}
              className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-60"
            >
              {request.isPending ? "Sending…" : "Yes, delete my account"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="border-line bg-surface text-ink rounded-lg border px-3 py-2 text-sm font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-bold text-rose-700 hover:bg-rose-50"
          >
            Ask to delete my account
          </button>
          <Link
            href={home}
            className="border-line bg-surface text-ink rounded-lg border px-3 py-2 text-sm font-bold"
          >
            Back to Momo
          </Link>
        </div>
      )}
      {request.error && (
        <p role="alert" className="text-rose-600">
          {request.error.message}
        </p>
      )}
    </div>
  );
}
