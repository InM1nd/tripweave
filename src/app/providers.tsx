"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { LenisProvider } from "@/components/landing/LenisProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Fetch even when offline — let SW serve cached responses.
            // Without this, React Query pauses queries when navigator.onLine is false.
            networkMode: "always",
            retry: (failureCount, error) => {
              // Don't retry network errors when offline
              if (typeof navigator !== "undefined" && !navigator.onLine) return false;
              return failureCount < 2;
            },
          },
          mutations: {
            networkMode: "always",
          },
        },
      })
  );

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("[SW] registered, scope:", reg.scope))
        .catch((err) => console.error("[SW] registration failed:", err));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="data-theme"
        storageKey="theme"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <LenisProvider>
          {children}
          <Toaster />
        </LenisProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
