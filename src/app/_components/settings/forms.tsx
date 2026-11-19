"use client";

import { useId, useState, useTransition } from "react";

import {
  changeEmail,
  changePassword,
  removePhoto,
  saveProfile,
  uploadPhoto,
} from "./actions";

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

/** Shrinks a picture to a centred 256×256 JPEG in the browser. */
async function squareJpeg(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("That file isn't a picture."));
      i.src = url;
    });
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("This browser can't resize pictures.");
    ctx.drawImage(
      img,
      (img.naturalWidth - side) / 2,
      (img.naturalHeight - side) / 2,
      side,
      side,
      0,
      0,
      256,
      256,
    );
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) =>
          b ? resolve(b) : reject(new Error("Could not read the picture.")),
        "image/jpeg",
        0.85,
      ),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function PhotoForm({
  name,
  image,
  locked,
}: {
  name: string;
  image: string | null;
  locked: boolean;
}) {
  const id = useId();
  const [preview, setPreview] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();
  const shown = preview ?? image;

  return (
    <div className="flex flex-wrap items-center gap-5 p-5">
      {shown ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={shown}
          alt="Your profile picture"
          className="size-24 rounded-full object-cover"
        />
      ) : (
        <span className="bg-canvas text-muted flex size-24 items-center justify-center rounded-full text-2xl font-bold">
          {name
            .split(/\s+/)
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </span>
      )}
      <div className="min-w-0 flex-1 space-y-2">
        <label
          htmlFor={`${id}-photo`}
          className={`border-line text-ink hover:bg-canvas inline-flex cursor-pointer rounded-xl border px-4 py-2 text-sm font-semibold transition ${locked ? "pointer-events-none opacity-60" : ""}`}
        >
          {image ? "Choose a new picture" : "Choose a picture"}
        </label>
        <input
          id={`${id}-photo`}
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={locked || pending}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setStatus(null);
            try {
              const small = await squareJpeg(file);
              setBlob(small);
              setPreview(URL.createObjectURL(small));
            } catch (error) {
              setStatus({
                ok: false,
                text:
                  error instanceof Error
                    ? error.message
                    : "Try another picture.",
              });
            }
          }}
        />
        <p className="text-muted text-xs">
          A clear photo of your face. It is cropped to a square.
        </p>
        <div className="flex flex-wrap gap-2">
          {blob && (
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const form = new FormData();
                  form.append(
                    "photo",
                    new File([blob], "photo.jpg", { type: "image/jpeg" }),
                  );
                  const result = await uploadPhoto(form);
                  if (result.ok) {
                    setBlob(null);
                    setStatus({ ok: true, text: "Picture saved." });
                  } else setStatus({ ok: false, text: result.error });
                })
              }
              className="bg-navy hover:bg-navy-deep rounded-xl px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save picture"}
            </button>
          )}
          {image && !blob && (
            <button
              type="button"
              disabled={pending || locked}
              onClick={() =>
                startTransition(async () => {
                  const result = await removePhoto();
                  setPreview(null);
                  setStatus(
                    result.ok
                      ? { ok: true, text: "Picture removed." }
                      : { ok: false, text: result.error },
                  );
                })
              }
              className="text-sm font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-60"
            >
              Remove picture
            </button>
          )}
        </div>
        <Status status={status} />
      </div>
    </div>
  );
}

export function EmailForm({
  email: current,
  locked,
}: {
  email: string | null;
  locked: boolean;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          const result = await changeEmail({ email, password });
          if (result.ok) {
            setPassword("");
            setEmail("");
            setStatus({
              ok: true,
              text: "Email saved. You can now also sign in with it.",
            });
          } else setStatus({ ok: false, text: result.error });
        });
      }}
      className="space-y-4 p-5"
    >
      <p className="text-sm">
        {current ? (
          <>
            Current email: <b className="text-ink">{current}</b>
          </>
        ) : (
          <span className="font-semibold text-rose-600">
            You have no email address yet. Add one to get school updates and
            reminders.
          </span>
        )}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-email`} className={label}>
            {current ? "New email address" : "Email address"}
          </label>
          <input
            id={`${id}-email`}
            type="email"
            required
            value={email}
            disabled={locked}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={field}
          />
        </div>
        <div>
          <label htmlFor={`${id}-pw`} className={label}>
            Your password (to confirm)
          </label>
          <input
            id={`${id}-pw`}
            type="password"
            required
            value={password}
            disabled={locked}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className={field}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending || locked}
          className="bg-navy hover:bg-navy-deep rounded-xl px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
        >
          {pending ? "Saving…" : current ? "Change email" : "Save email"}
        </button>
        <Status status={status} />
      </div>
      <p className="text-muted text-xs">
        Use the same email as in AskReyel so your reminders include your
        Momo work.
      </p>
    </form>
  );
}
