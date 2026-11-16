"use client";

import { useEffect } from "react";

/**
 * When Momo Smart is open inside the School Hub and the person signs out,
 * tell the Hub so it signs out too and returns to Reyel, its AI-Companion.
 */
export function HubSignout() {
  useEffect(() => {
    if (window.parent === window) return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has("signedout")) return;
    window.parent.postMessage({ hub: "signout" }, "*");
    url.searchParams.delete("signedout");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, []);
  return null;
}
