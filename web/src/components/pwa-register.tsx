"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    navigator.serviceWorker
      .register("/sw.js")
      .catch(() => {
        // Silent fail — PWA is a progressive enhancement, not critical
      });
  }, []);

  return null;
}
