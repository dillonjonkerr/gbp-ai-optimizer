"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-8 backdrop-blur">
      <div className="flex items-center gap-2.5">
        <Image
          src="/brand/icon.png"
          alt="Paint & Profits"
          width={44}
          height={44}
          className="h-11 w-11"
        />
        <span className="text-lg font-bold tracking-tight text-slate-900">
          Paint <span className="text-primary-500">&amp;</span> Profits
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Help
        </button>
        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium text-sm">
          U
        </div>
      </div>
    </header>
  );
}
