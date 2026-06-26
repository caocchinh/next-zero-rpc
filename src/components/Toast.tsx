"use client";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Toast() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handler = (e: any) => {
      setMessage(e.detail);
      clearTimeout(timeout);
      timeout = setTimeout(() => setMessage(""), 3000);
    };
    window.addEventListener("show-toast", handler);
    return () => {
      window.removeEventListener("show-toast", handler);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded bg-[oklch(0.95_0.01_250)] px-4 py-3 font-mono text-sm font-bold text-[#0a0a0a] shadow-[4px_4px_0_0_oklch(0.6_0.2_40)] border-2 border-[#0a0a0a]"
        >
          <Check className="h-5 w-5 text-green-500" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function showToast(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("show-toast", { detail: message }));
  }
}
