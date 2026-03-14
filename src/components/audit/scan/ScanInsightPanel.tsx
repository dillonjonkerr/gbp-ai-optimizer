"use client";

import { useState, useEffect } from "react";

export default function ScanInsightPanel({
  insight,
  visible,
}: {
  insight: string;
  visible: boolean;
}) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!visible || !insight) return;
    setDisplayedText("");
    let idx = 0;
    const timer = setInterval(() => {
      idx++;
      setDisplayedText(insight.slice(0, idx));
      if (idx >= insight.length) clearInterval(timer);
    }, 18);
    return () => clearInterval(timer);
  }, [visible, insight]);

  if (!visible) return null;

  return (
    <div
      className="rounded-2xl border border-[#29b6f6]/15 bg-[#29b6f6]/[0.04] p-5"
      style={{ animation: "fadeUp 0.6s ease-out" }}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#29b6f6]/15">
          <svg className="h-4 w-4 text-[#29b6f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-sm font-black text-[#29b6f6]">AI Insight</h3>
      </div>

      <p className="mt-3 text-sm font-medium leading-relaxed text-white/40">
        {displayedText}
        {displayedText.length < insight.length && (
          <span className="inline-block h-4 w-0.5 animate-pulse bg-[#29b6f6] align-text-bottom" />
        )}
      </p>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
