"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { LenisProvider } from "@/components/landing/LenisProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

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
