/**
 * Runs in the browser before Momo starts. Old iPhones that can't update past
 * iOS 12 (Safari 12) lack a few newer built-ins the app uses; this fills them
 * in. Newer browsers already have them, so nothing here runs there.
 */

function at(this: { length: number; [i: number]: unknown }, n: number) {
  let i = Math.trunc(n) || 0;
  if (i < 0) i += this.length;
  return i < 0 || i >= this.length ? undefined : this[i];
}

function define(target: object, name: string, value: unknown) {
  if (!(name in target)) {
    Object.defineProperty(target, name, {
      value,
      writable: true,
      configurable: true,
    });
  }
}

define(Array.prototype, "at", at);
define(String.prototype, "at", at);

define(
  String.prototype,
  "replaceAll",
  function replaceAll(
    this: string,
    search: string | RegExp,
    replacement: string | ((substring: string, ...args: unknown[]) => string),
  ) {
    const pattern =
      search instanceof RegExp
        ? search
        : new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    // `replace` with a global pattern replaces every match.
    return this.replace(pattern, replacement as string);
  },
);

if (typeof crypto !== "undefined" && !("randomUUID" in crypto)) {
  define(crypto, "randomUUID", function randomUUID() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6]! & 0x0f) | 0x40;
    bytes[8] = (bytes[8]! & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
      .slice(6, 8)
      .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
  });
}
