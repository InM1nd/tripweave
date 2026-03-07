"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function TripTabContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tabKey = pathname.split("/").pop() || "main";

  return (
    <motion.div
      key={tabKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="px-4 md:px-0"
    >
      {children}
    </motion.div>
  );
}
