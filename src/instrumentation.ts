/**
 * Runs once when the server starts. The school is in the Philippines, but
 * the hosting servers run on UTC — so every date the server formats or
 * builds (due times, calendars, the demo seed's "today at 11:59 PM") would
 * be 8 hours off. Node picks up a TZ change at runtime.
 */
export function register() {
  process.env.TZ = "Asia/Manila";
}
