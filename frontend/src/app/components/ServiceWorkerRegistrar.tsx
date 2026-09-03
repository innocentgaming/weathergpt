"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // In development (localhost), unregister any stale service workers to prevent aggressive caching
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
            console.log("[WeatherGPT] Dev mode: Unregistered Service Worker");
          }
        });
        if ("caches" in window) {
          caches.keys().then((names) => {
            for (const name of names) {
              if (name.startsWith("weathergpt-")) {
                caches.delete(name);
              }
            }
          });
        }
        return;
      }

      // In production, register the service worker
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          console.log("[WeatherGPT] Service Worker registered:", reg.scope);
        })
        .catch((err) => {
          console.warn("[WeatherGPT] Service Worker registration failed:", err);
        });
    }
  }, []);

  return null;
}
