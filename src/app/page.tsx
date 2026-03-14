import Link from "next/link";
import Image from "next/image";

const STATS = [
  { value: "15–30", label: "Extra jobs\nper month" },
  { value: "$999", label: "Flat monthly\nno contracts" },
  { value: "100+", label: "Painters\nscaled" },
  { value: "18X", label: "Average\nROI" },
];

const TESTIMONIALS = [
  {
    name: "Nick Kelly",
    company: "Elite Painting",
    result: "+15–30 jobs/mo from Google alone",
    quote:
      "We went from $8,519 to $356,728 after implementing the system. Google is now our #1 lead source.",
  },
  {
    name: "Russell Peach",
    company: "Peach Painting",
    result: "64 leads in 30 days from scratch",
    quote:
      "I had zero Google presence. Within 30 days I had 64 inbound leads — all from my Google profile.",
  },
  {
    name: "SwiftHand Painting",
    company: "SwiftHand Painting",
    result: "70+ inbound leads every month",
    quote:
      "We're booked 3 months out now. The AI optimization made our profile impossible to ignore.",
  },
];

const STEPS = [
  {
    num: "1",
    title: "Enter Your Business",
    desc: "Name and city — takes 10 seconds. Our AI instantly finds your Google Business Profile.",
    badge: null,
  },
  {
    num: "2",
    title: "AI Scans Your Market",
    desc: "We analyze your profile, find your top competitor, and identify every keyword gap costing you leads.",
    badge: null,
  },
  {
    num: "3",
    title: "Get Your Gap Report",
    desc: "See exactly where competitors outrank you, how many searches you're missing, and what to fix first.",
    badge: "AI-Powered",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#09090b]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/brand/icon.png"
              alt="Paint & Profits"
              width={40}
              height={40}
              className="h-10 w-10"
              priority
            />
            <span className="text-lg font-bold tracking-tight">
              Paint <span className="text-[#29b6f6]">&amp;</span> Profits
            </span>
          </Link>
          <Link
            href="/audit"
            className="rounded-full bg-[#29b6f6] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#29b6f6]/30 transition hover:shadow-[#29b6f6]/50"
          >
            Free Audit →
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-3xl px-5 pb-6 pt-16 text-center sm:pt-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#29b6f6]/25 bg-[#29b6f6]/[0.06] px-5 py-1.5 text-xs font-extrabold uppercase tracking-[3px] text-[#29b6f6]">
          Free AI-Powered Scan
        </div>

        <h1 className="text-[clamp(28px,7.5vw,52px)] font-black uppercase leading-[1.08] tracking-tight">
          Make Google Your{" "}
          <span className="text-[#29b6f6]">#1 Lead Source</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-[clamp(14px,3vw,17px)] font-medium leading-relaxed text-white/45">
          See exactly where competitors outrank you — and get an{" "}
          <strong className="font-bold text-white">
            AI-powered plan to fix it
          </strong>
          . Built specifically for painting companies.
        </p>

        <div className="mt-8">
          <Link
            href="/audit"
            className="inline-block rounded-full bg-[#29b6f6] px-9 py-4 text-base font-black uppercase tracking-wide text-white shadow-[0_8px_32px_rgba(41,182,246,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(41,182,246,0.55)]"
          >
            Get Your Free Google Audit →
          </Link>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-10 max-w-xl overflow-hidden rounded-2xl border border-white/[0.07] bg-[#16161a]">
          <div className="grid grid-cols-4 divide-x divide-white/[0.07]">
            {STATS.map((s) => (
              <div key={s.value} className="px-3 py-4 text-center sm:py-5">
                <div className="font-['Bebas_Neue',sans-serif] text-2xl leading-none text-[#29b6f6] sm:text-[38px]">
                  {s.value}
                </div>
                <div className="mt-1 whitespace-pre-line text-[9px] font-extrabold uppercase leading-snug tracking-[1.5px] text-white/30">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-t border-white/[0.07] bg-[#111113] px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-center text-[9px] font-extrabold uppercase tracking-[3px] text-[#29b6f6]">
            Real Results
          </p>
          <h2 className="text-center text-[clamp(22px,5vw,36px)] font-black uppercase leading-tight">
            Same System. <span className="text-[#29b6f6]">Different Painters.</span>
          </h2>
          <div className="mx-auto mt-2 h-0.5 w-12 rounded bg-gradient-to-r from-[#29b6f6] to-[#0ea5e9]" />
          <p className="mx-auto mt-4 max-w-md text-center text-sm font-medium text-white/45">
            Real owners. Real numbers. No scripts.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-white/[0.07] bg-[#16161a] p-6"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#29b6f6]/30 bg-[#29b6f6]/10 text-sm font-black text-[#29b6f6]">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold">{t.name}</p>
                    <p className="text-xs font-semibold text-white/30">
                      {t.company}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium leading-relaxed text-white/45">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 rounded-lg border border-[#22c55e]/20 bg-[#22c55e]/[0.06] px-3 py-2 text-xs font-extrabold text-[#22c55e]">
                  {t.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-center text-[9px] font-extrabold uppercase tracking-[3px] text-[#29b6f6]">
            How It Works
          </p>
          <h2 className="text-center text-[clamp(22px,5vw,36px)] font-black uppercase leading-tight">
            Your Free Audit in <span className="text-[#29b6f6]">3 Steps</span>
          </h2>
          <div className="mx-auto mt-2 h-0.5 w-12 rounded bg-gradient-to-r from-[#29b6f6] to-[#0ea5e9]" />

          <div className="mt-10 space-y-0">
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                className={`flex gap-5 py-5 ${i < STEPS.length - 1 ? "border-b border-white/[0.07]" : ""}`}
              >
                <div className="flex shrink-0 flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-[#29b6f6]/30 bg-[#29b6f6]/10 text-lg font-black text-[#29b6f6]">
                    {s.num}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="mt-2 min-h-[20px] w-[1.5px] flex-1 bg-gradient-to-b from-[#29b6f6]/30 to-transparent" />
                  )}
                </div>
                <div className="pt-1.5">
                  <h3 className="text-[17px] font-extrabold">{s.title}</h3>
                  <p className="mt-1 text-[13px] font-medium leading-relaxed text-white/45">
                    {s.desc}
                  </p>
                  {s.badge && (
                    <span className="mt-2 inline-block rounded-md border border-[#22c55e]/20 bg-[#22c55e]/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#22c55e]">
                      {s.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="border-t border-white/[0.07] bg-[#111113] px-5 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-lg">
          <p className="mb-6 text-[9px] font-extrabold uppercase tracking-[3px] text-[#29b6f6]">
            Stop Losing Leads
          </p>
          <h2 className="text-[clamp(22px,5.5vw,34px)] font-black uppercase leading-tight">
            Right Now, Someone Is Googling{" "}
            <span className="text-[#29b6f6]">&ldquo;Painter Near Me&rdquo;</span>{" "}
            In Your City
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-relaxed text-white/45">
            Find out who&apos;s getting that call — and what it takes to make it yours.
            Free. 60 seconds. No signup.
          </p>
          <div className="mt-8">
            <Link
              href="/audit"
              className="inline-block rounded-full bg-[#29b6f6] px-9 py-4 text-base font-black uppercase tracking-wide text-white shadow-[0_8px_32px_rgba(41,182,246,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(41,182,246,0.55)]"
            >
              Get Your Free Google Audit →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.07] px-5 py-8 text-center">
        <div className="flex items-center justify-center gap-2 opacity-40">
          <Image
            src="/brand/icon.png"
            alt="Paint & Profits"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <span className="text-sm font-bold tracking-tight">
            Paint <span className="text-[#29b6f6]">&amp;</span> Profits
          </span>
        </div>
        <p className="mt-2 text-[10px] font-semibold tracking-wide text-white/20">
          &copy; {new Date().getFullYear()} Paint &amp; Profits. Google Business Profile optimization for painters.
        </p>
      </footer>
    </div>
  );
}
