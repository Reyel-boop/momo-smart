"use client";

import { useEffect } from "react";

/**
 * Registers the service worker (public/sw.js), which shows an offline page
 * when there's no internet. Needed for Momo to install as an app.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Without it Momo still works; it just can't show the offline page.
    });
  }, []);
  return null;
}
