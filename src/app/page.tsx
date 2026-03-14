import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/icon.png"
              alt="GBP AI Optimizer"
              width={36}
              height={36}
              className="h-9 w-9"
              priority
            />
            <span className="text-lg font-semibold tracking-tight text-foreground">
              GBP AI Optimizer
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/audit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Free Audit
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient orb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
          
          <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                AI-Powered Profile Optimization
              </div>

              {/* Headline */}
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                Stop losing customers to
                <br />
                <span className="text-primary">competitors who rank higher</span>
              </h1>

              {/* Subheadline */}
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Discover the exact keyword gaps costing you local searches.
                Get AI-powered recommendations to outrank your competition
                on Google Business Profile.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link
                  href="/audit"
                  className="group rounded-lg bg-foreground px-8 py-3.5 text-base font-semibold text-background transition-all hover:bg-foreground/90"
                >
                  Scan My Business
                  <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
                <Link
                  href="#how"
                  className="rounded-lg border border-border bg-card/50 px-6 py-3 text-base font-medium text-foreground hover:bg-card transition-colors"
                >
                  How it works
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { value: "10K+", label: "Businesses scanned" },
                { value: "2.4M", label: "Keywords analyzed" },
                { value: "340%", label: "Avg. visibility increase" },
                { value: "Free", label: "Audit & recommendations" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-card/50 p-6 text-center"
                >
                  <p className="text-2xl font-bold text-foreground sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-border py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Get actionable insights in under 60 seconds. Our AI scans your local market
                and builds a custom optimization plan.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Enter your business",
                  description: "Tell us your business name, location, and industry. Takes 10 seconds.",
                },
                {
                  step: "02",
                  title: "AI scans your market",
                  description: "We analyze local keywords, check your rankings, and find your top competitors.",
                },
                {
                  step: "03",
                  title: "Get your optimization plan",
                  description: "See exactly where you're losing searches and how to fix it with AI-generated content.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-border bg-card p-8"
                >
                  <span className="text-4xl font-bold text-muted-foreground/30">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border py-24 bg-card/30">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
                  Everything you need to dominate local search
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Our AI analyzes thousands of data points to find the exact opportunities
                  your competitors are exploiting.
                </p>

                <ul className="mt-8 space-y-4">
                  {[
                    "Keyword gap analysis with search volume data",
                    "Head-to-head competitor comparison",
                    "AI-written business descriptions",
                    "Optimized post suggestions",
                    "Q&A entries that capture searches",
                    "Priority action items ranked by impact",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                    <span className="text-muted-foreground">Missed searches/month</span>
                    <span className="text-xl font-bold text-destructive">2,400</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                    <span className="text-muted-foreground">Keyword gaps found</span>
                    <span className="text-xl font-bold text-warning">47</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                    <span className="text-muted-foreground">Competitor advantage</span>
                    <span className="text-xl font-bold text-foreground">+23%</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Example analysis for a local painting business
                  </p>
                  <Link
                    href="/audit"
                    className="block w-full rounded-lg bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    See my analysis
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Ready to outrank your competitors?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Get your free audit in under 60 seconds. No credit card required.
              See exactly where you stand and how to improve.
            </p>
            <Link
              href="/audit"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-foreground px-8 py-4 text-base font-semibold text-background hover:bg-foreground/90 transition-colors"
            >
              Start Free Audit
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/brand/icon.png"
              alt="GBP AI Optimizer"
              width={24}
              height={24}
              className="h-6 w-6 opacity-60"
            />
            <span className="text-sm font-medium text-muted-foreground">
              GBP AI Optimizer
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GBP AI Optimizer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
