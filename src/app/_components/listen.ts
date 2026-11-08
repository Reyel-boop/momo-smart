/**
 * Listening through the microphone with the browser's speech recognition
 * (Chrome, Edge, Android Chrome and Safari 14.5+). Nothing is recorded or
 * stored: the browser turns speech into text, and only the text is used.
 */

type Alternative = { transcript: string };
type RecognitionResult = {
  isFinal: boolean;
  length: number;
  [index: number]: Alternative | undefined;
};
type RecognitionEvent = {
  resultIndex: number;
  results: { length: number; [index: number]: RecognitionResult | undefined };
};
type Recognizer = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type RecognizerClass = new () => Recognizer;

function recognizerClass(): RecognizerClass | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognizerClass;
    webkitSpeechRecognition?: RecognizerClass;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Whether this browser can turn speech into text. */
export function listenSupported() {
  return recognizerClass() !== null;
}

/** What a failed listen means, in words a student understands. */
export function listenErrorText(code: string) {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Momo can't use your microphone. Tap the 🔒 lock icon beside the web address, set Microphone to Allow, then try again.";
    case "audio-capture":
      return "No microphone was found. Plug in a headset or use a phone, then try again.";
    case "network":
      return "Listening needs the internet. Check your connection and try again.";
    case "no-speech":
      return "I didn't hear anything. Tap the microphone and speak a little louder.";
    default:
      return "Something went wrong while listening. Tap the microphone and try again.";
  }
}

export type Listener = { stop: () => void; cancel: () => void };

/**
 * Listens for one answer. `onInterim` shows the words as they are heard;
 * `onDone` gets up to three guesses of the whole answer (best first), or an
 * empty list when nothing was heard. Listening stops on its own after a
 * pause, or when `stop()` is called.
 */
export function listen({
  onInterim,
  onDone,
  onError,
  pauseMs = 2200,
  maxMs = 40000,
}: {
  onInterim: (text: string) => void;
  onDone: (guesses: string[]) => void;
  onError: (code: string) => void;
  pauseMs?: number;
  maxMs?: number;
}): Listener | null {
  const Recognition = recognizerClass();
  if (!Recognition) return null;
  const recognizer = new Recognition();
  recognizer.lang = "en-US";
  recognizer.interimResults = true;
  recognizer.maxAlternatives = 3;
  // Android Chrome repeats earlier words in continuous mode, so there it
  // listens for one stretch of speech at a time.
  recognizer.continuous =
    typeof navigator !== "undefined" && !/Android/i.test(navigator.userAgent);

  /** Final segments, each with its guesses. */
  const segments: string[][] = [];
  let failed = false;
  let pause: ReturnType<typeof setTimeout> | undefined;
  const limit = setTimeout(() => recognizer.stop(), maxMs);

  recognizer.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (!result) continue;
      if (result.isFinal) {
        // A result is array-like but not always iterable, so index it.
        const guesses = Array.from(
          { length: result.length },
          (_, k) => result[k]?.transcript.trim() ?? "",
        ).filter(Boolean);
        if (guesses.length) segments[i] = guesses;
      } else {
        interim += result[0]?.transcript ?? "";
      }
    }
    const heard = segments
      .filter(Boolean)
      .map((g) => g[0])
      .join(" ");
    onInterim(`${heard} ${interim}`.trim());
    clearTimeout(pause);
    pause = setTimeout(() => recognizer.stop(), pauseMs);
  };
  recognizer.onerror = (event) => {
    if (event.error === "aborted") return;
    if (event.error === "no-speech" && segments.length) return;
    failed = true;
    onError(event.error);
  };
  recognizer.onend = () => {
    clearTimeout(pause);
    clearTimeout(limit);
    if (failed) return;
    const parts = segments.filter(Boolean);
    const count = Math.max(0, ...parts.map((g) => g.length));
    const guesses: string[] = [];
    for (let k = 0; k < count; k++) {
      guesses.push(parts.map((g) => g[k] ?? g[0]).join(" "));
    }
    onDone([...new Set(guesses)]);
  };

  try {
    recognizer.start();
  } catch {
    clearTimeout(limit);
    return null;
  }
  return {
    stop: () => recognizer.stop(),
    cancel: () => {
      failed = true;
      clearTimeout(pause);
      clearTimeout(limit);
      recognizer.abort();
    },
  };
}
