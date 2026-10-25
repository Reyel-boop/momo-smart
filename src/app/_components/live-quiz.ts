/** Shared look of the Live Quiz: answer tiles A–D and small helpers. */

/** Tile colors by position: A blue, B green, C orange, D red. */
export const TILE_STYLES = [
  "bg-blue-600 hover:bg-blue-500",
  "bg-emerald-600 hover:bg-emerald-500",
  "bg-orange-500 hover:bg-orange-400",
  "bg-rose-600 hover:bg-rose-500",
] as const;

export const tileStyle = (index: number) =>
  TILE_STYLES[index % TILE_STYLES.length]!;

export const TEAM_NAMES = ["Team A", "Team B"] as const;
export const TEAM_STYLES = ["bg-blue-600", "bg-rose-600"] as const;

/** 15000 → "15" (whole seconds left, rounded up). */
export const secondsLeft = (ms: number) => Math.max(0, Math.ceil(ms / 1000));

/** 1350 → "1,350". */
export const points = (n: number) => n.toLocaleString("en-PH");
