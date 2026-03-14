import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/brand/icon.png"
              alt="Paint & Profits"
              width={44}
              height={44}
              className="h-11 w-11"
              priority
            />
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Paint <span className="text-primary-500">&amp;</span> Profits
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Dashboard
            </Link>
            <Link
              href="/audit"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
            >
              Free Audit
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-24">
        <section className="text-center">
          <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
            Free Google Business Profile Audit
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            See how your painting business ranks
            <br />
            <span className="text-primary-600">before your competitors do</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Get a full local market scan, competitor comparison, and a
            step-by-step AI optimization plan — built specifically for painters.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/audit"
              className="rounded-lg bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              Run Free Audit
            </Link>
            <Link
              href="#how"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              How it works
            </Link>
          </div>
        </section>

        <section id="how" className="mt-32">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                step: "1",
                title: "Enter your business",
                description: "Name, city, and industry — takes 10 seconds.",
              },
              {
                step: "2",
                title: "Local market scan",
                description:
                  "We find the top keywords and see where you rank.",
              },
              {
                step: "3",
                title: "Competitor report",
                description:
                  "See your score vs. competitors with AI insights.",
              },
              {
                step: "4",
                title: "Get your plan",
                description:
                  "We build a custom optimization plan for your profile.",
              },
              {
                step: "5",
                title: "Optimize step-by-step",
                description:
                  "Follow our guided wizard to fix everything.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                  {item.step}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-32 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Ready to see where you stand?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Free audit, no credit card. Get your score in under 60 seconds.
          </p>
          <Link
            href="/audit"
            className="mt-6 inline-block rounded-lg bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            Run Free Audit
          </Link>
        </section>
      </main>

      <footer className="mt-24 border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-sm text-slate-500">
          <div className="flex items-center gap-2 opacity-60">
            <Image
              src="/brand/icon.png"
              alt="Paint & Profits"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="text-sm font-bold tracking-tight text-slate-600">
              Paint <span className="text-primary-500">&amp;</span> Profits
            </span>
          </div>
          <p>&copy; {new Date().getFullYear()} Paint &amp; Profits. Marketing for painters.</p>
        </div>
      </footer>
    </div>
  );
}
