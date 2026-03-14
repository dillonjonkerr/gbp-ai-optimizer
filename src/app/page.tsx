"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { AIBadge } from "@/components/ai-badge";
import { ReviewsSection } from "@/components/reviews-section";
import {
  Search,
  ArrowRight,
  CheckCircle2,
  Star,
  Sparkles,
  TrendingUp,
  Users,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-16 items-center justify-between px-5 sm:h-[72px] sm:px-6">
          <Logo size="md" />
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90"
          >
            Free Audit
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="pb-safe">
        {/* Hero Section */}
        <div className="flex flex-col px-5 py-10 sm:px-6 sm:py-16">
          <div className="mx-auto w-full max-w-lg space-y-6 text-center">
            <AIBadge className="mx-auto animate-scale-in" />

            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance leading-[1.1]">
              See where you rank on{" "}
              <span className="text-primary">Google Maps</span>
            </h1>

            <p className="mx-auto max-w-sm text-base font-medium text-muted-foreground sm:text-lg">
              Get a free local visibility report for your painting business in
              30 seconds
            </p>

            {/* Geo-Grid Preview */}
            <div className="p-4 bg-card rounded-2xl border-2 border-border shadow-lg relative overflow-hidden">
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  <Sparkles className="h-3 w-3" />
                  Preview
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1 mb-4">
                {[
                  3, 5, 7, 8, 12, 2, 1, 4, 6, 9, 4, 3, 1, 2, 5, 8, 6, 3, 4,
                  7, 11, 9, 5, 6, 8,
                ].map((num, i) => (
                  <div
                    key={i}
                    className={cn(
                      "aspect-square rounded-lg flex items-center justify-center text-xs font-black text-white transition-all",
                      num <= 3
                        ? "bg-green-500"
                        : num <= 7
                          ? "bg-amber-400"
                          : "bg-red-400"
                    )}
                  >
                    {num}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-green-500" />
                    <span className="font-semibold text-muted-foreground">
                      Top 3
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-amber-400" />
                    <span className="font-semibold text-muted-foreground">
                      4-7
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-red-400" />
                    <span className="font-semibold text-muted-foreground">
                      8+
                    </span>
                  </span>
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  Map Pack Rankings
                </span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex justify-center gap-6 text-center">
              <div>
                <div className="text-2xl font-black text-foreground sm:text-3xl">
                  70%
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  of clicks go to
                  <br />
                  Map Pack
                </div>
              </div>
              <div className="w-px bg-border" />
              <div>
                <div className="text-2xl font-black text-foreground sm:text-3xl">
                  88%
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  call or visit
                  <br />
                  within 24hrs
                </div>
              </div>
              <div className="w-px bg-border" />
              <div>
                <div className="text-2xl font-black text-primary sm:text-3xl">
                  3x
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  more leads with
                  <br />
                  optimized GBP
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/audit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-black text-primary-foreground shadow-xl shadow-primary/40 transition-all hover:bg-primary/90 animate-pulse-glow"
            >
              <Search className="h-5 w-5" />
              Scan My Business
              <ArrowRight className="h-5 w-5" />
            </Link>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Free forever
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                No signup
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                30 sec results
              </span>
            </div>

            {/* Social proof */}
            <div className="p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["J", "M", "R", "S", "T"].map((letter, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white text-xs font-bold shadow-md"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                    <span className="text-xs font-bold text-foreground ml-1">
                      4.9
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground truncate">
                    Trusted by{" "}
                    <span className="text-foreground font-bold">10,000+</span>{" "}
                    painting contractors
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="text-center">
              <p className="text-sm italic text-muted-foreground">
                &ldquo;Found out I was missing 40+ keywords my competitors were
                ranking for. Fixed it and calls doubled.&rdquo;
              </p>
              <p className="mt-2 text-xs font-bold text-foreground">
                — Mike T., Pro Painters Dallas
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section className="border-t-2 border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-4xl px-5 sm:px-6">
            <h2 className="text-center text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              How It Works
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: MapPin,
                  title: "Enter your business",
                  description:
                    "Type your business name and city — takes 10 seconds.",
                },
                {
                  icon: TrendingUp,
                  title: "AI scans your market",
                  description:
                    "We analyze competitors, keywords, and your visibility.",
                },
                {
                  icon: Users,
                  title: "See your gap report",
                  description:
                    "Get a clear view of what you're missing and how to fix it.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="text-center rounded-2xl border-2 border-border bg-card p-6 shadow-sm"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-base font-black text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Reviews */}
      <ReviewsSection />

      {/* Footer */}
      <footer className="border-t-2 border-border bg-background py-6">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
          <p className="text-sm font-semibold text-muted-foreground">
            Paint &amp; Profits — Marketing for Painters
          </p>
        </div>
      </footer>
    </div>
  );
}
