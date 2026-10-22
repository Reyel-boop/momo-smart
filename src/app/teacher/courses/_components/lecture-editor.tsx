"use client";

import { useId, useState, useTransition } from "react";

import { NotePenIcon, PlayFillIcon } from "~/app/_components/icons";
import { normaliseLectureUrl, youTubeId } from "~/lib/video";
import { saveLecture } from "../actions";

/**
 * Per-lesson "Lecture" control on the teacher Courses page: shows whether the
 * lesson has a lecture video and written lecture, and edits both in place.
 */
export function LectureEditor({
  lessonId,
  videoUrl,
  lecture,
}: {
  lessonId: string;
  videoUrl: string | null;
  lecture: string | null;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState(videoUrl ?? "");
  const [text, setText] = useState(lecture ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  const trimmedLink = link.trim();
  const linkInvalid =
    trimmedLink.length > 0 && normaliseLectureUrl(trimmedLink) === null;
  const previewId = youTubeId(trimmedLink);

  const cancel = () => {
    setLink(videoUrl ?? "");
    setText(lecture ?? "");
    setError(null);
    setOpen(false);
  };

  const save = () => {
    setError(null);
    startSaving(async () => {
      const result = await saveLecture(lessonId, trimmedLink, text);
      if (result.ok) setOpen(false);
      else setError(result.error);
    });
  };

  if (!open) {
    return (
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 ${
            videoUrl ? "bg-emerald-50 text-emerald-700" : "bg-canvas text-muted"
          }`}
        >
          <PlayFillIcon className="size-3" />
          {videoUrl ? "Lecture video" : "No video"}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 ${
            lecture ? "bg-emerald-50 text-emerald-700" : "bg-canvas text-muted"
          }`}
        >
          <NotePenIcon className="size-3" />
          {lecture ? "Written lecture" : "No written lecture"}
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-brand ml-auto font-bold hover:underline"
        >
          {videoUrl || lecture ? "Edit lecture" : "Add lecture"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
      className="border-line mt-3 space-y-3 border-t pt-3"
    >
      <div>
        <label htmlFor={`${id}-video`} className="text-ink text-xs font-bold">
          Lecture video link
        </label>
        <input
          id={`${id}-video`}
          type="url"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="https://www.youtube.com/watch?v=…"
          aria-invalid={linkInvalid}
          aria-describedby={`${id}-video-hint`}
          className="border-line bg-canvas text-ink placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-brand/10 mt-1 w-full rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-4"
        />
        <p
          id={`${id}-video-hint`}
          className={`mt-1 text-[11px] ${linkInvalid ? "text-rose-600" : "text-muted"}`}
        >
          {linkInvalid
            ? "Use a YouTube link, or a direct link to a video file (.mp4, .webm)."
            : "Paste a YouTube link or a video file link. Leave empty for no video."}
        </p>
        {previewId && (
          // eslint-disable-next-line @next/next/no-img-element -- remote thumbnail, no optimisation needed
          <img
            src={`https://i.ytimg.com/vi/${previewId}/mqdefault.jpg`}
            alt="Video thumbnail"
            className="mt-2 aspect-video w-48 rounded-lg object-cover"
          />
        )}
      </div>

      <div>
        <label htmlFor={`${id}-text`} className="text-ink text-xs font-bold">
          Written lecture
        </label>
        <textarea
          id={`${id}-text`}
          rows={10}
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={50_000}
          placeholder={
            "## Topic heading\nExplain the lesson here.\n\n- A key point\n- **Bold** for terms"
          }
          className="border-line bg-canvas text-ink placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-brand/10 mt-1 w-full resize-y rounded-lg border px-3 py-2 font-mono text-xs leading-relaxed transition outline-none focus:ring-4"
        />
        <p className="text-muted mt-1 text-[11px]">
          Students see this as the Lecture tab. Use ## for headings, - for
          bullet points and **double asterisks** for bold.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-xs text-rose-600">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={cancel}
          className="border-line text-ink hover:bg-canvas rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || linkInvalid}
          className="bg-navy hover:bg-navy-deep rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save lecture"}
        </button>
      </div>
    </form>
  );
}
