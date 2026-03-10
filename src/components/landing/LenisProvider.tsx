"use client";

import { usePathname } from "next/navigation";
import { ReactLenis } from "lenis/react";
import { useState, useEffect } from "react";

const lenisOptions = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  smoothWheel: true,
  touchMultiplier: 2,
  autoRaf: true,
};

// Desktop = fine pointer (mouse/trackpad) + wide enough screen.
// Checked client-side only to avoid SSR mismatch; default is false so
// mobile users never receive Lenis on first render.
const DESKTOP_MQ = "(pointer: fine) and (min-width: 1024px)";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isLanding && isDesktop) {
    return (
      <>
        <ReactLenis root options={lenisOptions} />
        {children}
      </>
    );
  }

  return <>{children}</>;
}
