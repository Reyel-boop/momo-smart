/**
 * Lecture video links. Teachers paste whatever YouTube link their browser
 * shows (watch, youtu.be, shorts, embed, live); everything else must be a
 * direct video file the browser can play.
 */

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
]);

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/** The 11-character video id of a YouTube link, or null for anything else. */
export function youTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }
  if (!YOUTUBE_HOSTS.has(parsed.hostname.toLowerCase())) return null;

  const [first, second] = parsed.pathname.split("/").filter(Boolean);
  const id =
    parsed.hostname.toLowerCase() === "youtu.be"
      ? first
      : first === "watch"
        ? parsed.searchParams.get("v")
        : first && ["embed", "shorts", "live", "v"].includes(first)
          ? second
          : null;
  return id && VIDEO_ID.test(id) ? id : null;
}

/** A direct video file (mp4, webm, HLS) rather than a page. */
export function isVideoFile(url: string): boolean {
  try {
    return /\.(mp4|webm|ogg|m3u8)$/i.test(new URL(url).pathname);
  } catch {
    return false;
  }
}

/**
 * The stored form of a lecture link: YouTube links become one canonical
 * watch URL; other links are kept only if they point at a video file.
 * Returns null when the link can't be played.
 */
export function normaliseLectureUrl(url: string): string | null {
  const id = youTubeId(url);
  if (id) return `https://www.youtube.com/watch?v=${id}`;
  const trimmed = url.trim();
  return /^https:\/\//i.test(trimmed) && isVideoFile(trimmed) ? trimmed : null;
}

/**
 * Title of the lesson tab that holds the written lecture. The lecture is an
 * ordinary READING section; this title is what marks it as the one the
 * teacher's "Lecture" editor reads and writes.
 */
export const LECTURE_SECTION_TITLE = "Lecture";
