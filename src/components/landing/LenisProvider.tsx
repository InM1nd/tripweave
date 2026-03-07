"use client";

import { usePathname } from "next/navigation";
import { ReactLenis } from "lenis/react";

const lenisOptions = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  smoothWheel: true,
  touchMultiplier: 2,
  autoRaf: true,
};

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return (
      <>
        <ReactLenis root options={lenisOptions} />
        {children}
      </>
    );
  }

  return <>{children}</>;
}
