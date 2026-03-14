"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

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
    <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 shadow-md animate-fade-in-up">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
          <Sparkles className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-black text-primary">AI Insight</h3>
      </div>

      <p className="mt-3 text-sm font-medium leading-relaxed text-foreground/80">
        {displayedText}
        {displayedText.length < insight.length && (
          <span className="inline-block h-4 w-0.5 animate-pulse bg-primary align-text-bottom" />
        )}
      </p>
    </div>
  );
}
