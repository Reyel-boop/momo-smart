"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { BookmarkIcon, NotePenIcon } from "~/app/_components/icons";
import { mmss } from "~/app/student/_components/format";
import { addLessonNote, saveLessonProgress } from "../actions";

type Marker = { id: string; label: string; positionSeconds: number };
type Note = { id: string; body: string; timestampSeconds: number | null };

/** The slice of the YouTube IFrame API this player uses. */
type YTPlayer = {
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  pauseVideo: () => void;
  playVideo: () => void;
  destroy: () => void;
};
type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      host?: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: () => void;
        onStateChange?: (event: { data: number }) => void;
      };
    },
  ) => YTPlayer;
};
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PLAYING = 1;
const AUTOSAVE_MS = 15_000;

/** Loads the IFrame API once per page, however many players ask for it. */
let apiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  apiPromise ??= new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT!);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error("YouTube player failed to load"));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
}

/**
 * Lecture player for YouTube-hosted lectures. Same job as LecturePlayer —
 * resume where the student left off, autosave the position, timestamped
 * notes — with YouTube's own controls in place of ours.
 */
export function YouTubeLecture({
  lessonId,
  videoId,
  heading,
  badge,
  startAt,
  markers,
  notes,
  viewers,
}: {
  lessonId: string;
  videoId: string;
  heading: string;
  badge: string;
  startAt: number;
  markers: Marker[];
  notes: Note[];
  viewers: number;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const lastSaved = useRef(startAt);
  // Only the first render's resume point: saving a note re-renders the page
  // with a newer one, and that must not restart the video.
  const resumeAt = useRef(startAt);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [noteAt, setNoteAt] = useState<number | null>(null);
  const [noteBody, setNoteBody] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [savingNote, startSavingNote] = useTransition();

  // Saves the position (and the video's length, which only YouTube knows)
  // so the lesson's progress and completion follow the student's watching.
  const persist = () => {
    const player = playerRef.current;
    if (!player) return;
    const whole = Math.floor(player.getCurrentTime());
    if (whole === lastSaved.current) return;
    lastSaved.current = whole;
    const duration = Math.floor(player.getDuration());
    void saveLessonProgress(lessonId, whole, duration > 0 ? duration : null);
  };
  const persistRef = useRef(persist);
  persistRef.current = persist;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let cancelled = false;
    const target = document.createElement("div");
    mount.appendChild(target);

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return;
        playerRef.current = new YT.Player(target, {
          videoId,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            start: resumeAt.current > 5 ? resumeAt.current : 0,
          },
          events: {
            onReady: () => setReady(true),
            onStateChange: ({ data }) => {
              setPlaying(data === PLAYING);
              if (data !== PLAYING) persistRef.current();
            },
          },
        });
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      const player = playerRef.current;
      if (player && player.getPlayerState?.() === PLAYING) {
        persistRef.current();
      }
      player?.destroy();
      playerRef.current = null;
      mount.replaceChildren();
    };
  }, [videoId]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => persistRef.current(), AUTOSAVE_MS);
    return () => clearInterval(timer);
  }, [playing]);

  const seek = (seconds: number) => {
    const player = playerRef.current;
    if (!player || !ready) return;
    player.seekTo(seconds, true);
    player.playVideo();
  };

  const startNote = () => {
    const player = playerRef.current;
    player?.pauseVideo();
    setNoteError(null);
    setNoteAt(Math.floor(player && ready ? player.getCurrentTime() : 0));
  };

  const saveNote = () => {
    const body = noteBody.trim();
    if (!body) return;
    startSavingNote(async () => {
      try {
        await addLessonNote(lessonId, body, noteAt);
        setNoteBody("");
        setNoteAt(null);
      } catch {
        setNoteError("Your note could not be saved. Please try again.");
      }
    });
  };

  return (
    <section className="border-line bg-surface shadow-card overflow-hidden rounded-2xl border">
      <div className="bg-navy-deep flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
          <span className="size-2 rounded-full bg-rose-500" />
          {badge}
        </span>
        <p className="min-w-0 truncate text-sm font-semibold text-white/90">
          {heading}
        </p>
      </div>

      <div className="relative aspect-video w-full bg-black">
        <div
          ref={mountRef}
          className="absolute inset-0 [&_iframe]:size-full"
        />
        {failed && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <p className="rounded-lg bg-black/60 px-3 py-1.5 text-center text-xs text-white/85">
              The lecture video couldn&apos;t be loaded.{" "}
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                Watch it on YouTube
              </a>
            </p>
          </div>
        )}
      </div>

      <div className="bg-canvas/60 flex flex-wrap items-center gap-x-3 gap-y-2 px-5 py-3 text-xs">
        {markers.map((marker) => (
          <button
            key={marker.id}
            type="button"
            onClick={() => seek(marker.positionSeconds)}
            disabled={!ready}
            className="text-navy inline-flex items-center gap-1.5 font-semibold enabled:hover:underline"
          >
            <BookmarkIcon className="size-3.5" />
            Key Marker: {marker.label} ({mmss(marker.positionSeconds)})
          </button>
        ))}
        {viewers > 0 && (
          <span className="text-muted">
            {viewers} student{viewers === 1 ? "" : "s"} watching right now
          </span>
        )}
        <button
          type="button"
          onClick={startNote}
          className="bg-navy hover:bg-navy-deep ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold text-white transition"
        >
          <NotePenIcon className="size-4" />
          Take Timestamped Note
        </button>
      </div>

      {(noteAt !== null || notes.length > 0) && (
        <div className="border-line border-t px-5 py-4">
          {noteAt !== null && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                saveNote();
              }}
              className="mb-4"
            >
              <label
                htmlFor={`note-${lessonId}`}
                className="text-ink text-xs font-bold"
              >
                Note at {mmss(noteAt)}
              </label>
              <textarea
                id={`note-${lessonId}`}
                rows={3}
                value={noteBody}
                onChange={(event) => setNoteBody(event.target.value)}
                maxLength={5000}
                placeholder="What stood out at this point in the lecture?"
                className="border-line bg-canvas text-ink placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-brand/10 mt-2 w-full resize-y rounded-xl border px-3 py-2 text-sm transition outline-none focus:ring-4"
              />
              {noteError && (
                <p role="alert" className="mt-1 text-xs text-rose-600">
                  {noteError}
                </p>
              )}
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNoteAt(null)}
                  className="border-line text-ink hover:bg-canvas rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingNote || noteBody.trim().length === 0}
                  className="bg-navy hover:bg-navy-deep rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingNote ? "Saving…" : "Save Note"}
                </button>
              </div>
            </form>
          )}

          {notes.length > 0 && (
            <>
              <p className="text-muted text-[11px] font-bold tracking-wide uppercase">
                My Notes ({notes.length})
              </p>
              <ul className="mt-2 space-y-2">
                {notes.map((note) => (
                  <li key={note.id} className="flex gap-3 text-sm">
                    {note.timestampSeconds !== null && (
                      <button
                        type="button"
                        onClick={() => seek(note.timestampSeconds ?? 0)}
                        disabled={!ready}
                        className="bg-brand-soft text-brand h-fit shrink-0 rounded-md px-2 py-0.5 font-mono text-[11px] font-bold"
                      >
                        {mmss(note.timestampSeconds)}
                      </button>
                    )}
                    <p className="text-ink min-w-0 whitespace-pre-line">
                      {note.body}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}
