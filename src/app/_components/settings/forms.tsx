"use client";

import { useId, useState, useTransition } from "react";

import { changePassword, saveProfile } from "./actions";

const field =
  "border-line bg-canvas text-ink placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-brand/10 mt-1 w-full rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-4 disabled:opacity-60";
const label = "text-ink text-xs font-bold";

function Status({ status }: { status: { ok: boolean; text: string } | null }) {
  if (!status) return null;
  return (
    <p
      role={status.ok ? "status" : "alert"}
      className={`text-sm ${status.ok ? "text-emerald-700" : "text-rose-600"}`}
    >
      {status.text}
    </p>
  );
}

export function ProfileForm({
  name: initialName,
  title: initialTitle,
  officeLocation: initialOffice,
  bio: initialBio,
  isTeacher,
}: {
  name: string;
  title: string;
  officeLocation: string;
  bio: string;
  isTeacher: boolean;
}) {
  const id = useId();
  const [name, setName] = useState(initialName);
  const [title, setTitle] = useState(initialTitle);
  const [office, setOffice] = useState(initialOffice);
  const [bio, setBio] = useState(initialBio);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setStatus(null);
        startTransition(async () => {
          const result = await saveProfile(
            isTeacher ? { name, title, officeLocation: office, bio } : { name },
          );
          setStatus(
            result.ok
              ? { ok: true, text: "Profile saved." }
              : { ok: false, text: result.error },
          );
        });
      }}
      className="space-y-4 p-5"
    >
      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
        {isTeacher && (
          <div>
            <label htmlFor={`${id}-title`} className={label}>
              Title
            </label>
            <input
              id={`${id}-title`}
              value={title}
              maxLength={20}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dr., Ms., Mr."
              className={field}
            />
          </div>
        )}
        <div className={isTeacher ? "" : "sm:col-span-2"}>
          <label htmlFor={`${id}-name`} className={label}>
            Full name
          </label>
          <input
            id={`${id}-name`}
            required
            value={name}
            maxLength={120}
            onChange={(e) => setName(e.target.value)}
            className={field}
          />
        </div>
      </div>
      {isTeacher && (
        <>
          <div>
            <label htmlFor={`${id}-office`} className={label}>
              Office or room
            </label>
            <input
              id={`${id}-office`}
              value={office}
              maxLength={120}
              onChange={(e) => setOffice(e.target.value)}
              className={field}
            />
          </div>
          <div>
            <label htmlFor={`${id}-bio`} className={label}>
              Short bio
            </label>
            <textarea
              id={`${id}-bio`}
              rows={3}
              value={bio}
              maxLength={2000}
              onChange={(e) => setBio(e.target.value)}
              className={`${field} resize-y`}
            />
          </div>
        </>
      )}
      <div className="flex items-center justify-end gap-3">
        <Status status={status} />
        <button
          type="submit"
          disabled={pending}
          className="bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}

export function PasswordForm({ locked }: { locked: boolean }) {
  const id = useId();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setStatus(null);
        if (next !== confirm) {
          setStatus({ ok: false, text: "The new passwords don't match." });
          return;
        }
        startTransition(async () => {
          const result = await changePassword({
            currentPassword: current,
            newPassword: next,
          });
          if (result.ok) {
            setCurrent("");
            setNext("");
            setConfirm("");
            setStatus({ ok: true, text: "Password changed." });
          } else {
            setStatus({ ok: false, text: result.error });
          }
        });
      }}
      className="space-y-4 p-5"
    >
      {locked && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
          This is a shared demo account, so its password can&apos;t be changed.
        </p>
      )}
      <fieldset disabled={locked || pending} className="space-y-4">
        <div>
          <label htmlFor={`${id}-current`} className={label}>
            Current password
          </label>
          <input
            id={`${id}-current`}
            type="password"
            autoComplete="current-password"
            required
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className={field}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-new`} className={label}>
              New password
            </label>
            <input
              id={`${id}-new`}
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className={field}
            />
          </div>
          <div>
            <label htmlFor={`${id}-confirm`} className={label}>
              Confirm new password
            </label>
            <input
              id={`${id}-confirm`}
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={field}
            />
          </div>
        </div>
      </fieldset>
      <div className="flex items-center justify-end gap-3">
        <Status status={status} />
        <button
          type="submit"
          disabled={locked || pending}
          className="bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Changing…" : "Change password"}
        </button>
      </div>
    </form>
  );
}
