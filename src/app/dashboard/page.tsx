import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="mt-1 text-muted-foreground">
          Your Google Business Profile performance at a glance.
        </p>
      </div>

      {/* Top metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Visibility Score"
          value="72"
          suffix="/100"
          change="+8%"
          trend="up"
          href="/dashboard/keywords"
        />
        <MetricCard
          label="Keyword Rankings"
          value="23"
          change="+5"
          trend="up"
          href="/dashboard/keywords"
        />
        <MetricCard
          label="Competitor Gap"
          value="47"
          suffix=" keywords"
          change="-12"
          trend="down"
          href="/dashboard/competitors"
        />
        <MetricCard
          label="Missed Traffic"
          value="2,400"
          suffix="/mo"
          change="-340"
          trend="down"
          href="/dashboard/keywords"
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Optimization tasks */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Optimization Tasks
              </h2>
              <p className="text-sm text-muted-foreground">
                Priority actions to improve your rankings
              </p>
            </div>
            <Link
              href="/dashboard/tasks"
              className="text-xs font-medium text-primary hover:text-primary/80"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            <TaskItem
              title="Add 5 more photos to your profile"
              description="Profiles with 20+ photos get 2x more engagement"
              priority="high"
              impact="+15% visibility"
            />
            <TaskItem
              title="Respond to 3 unanswered reviews"
              description="Review responses signal active management to Google"
              priority="high"
              impact="+8% trust"
            />
            <TaskItem
              title="Update business description with keywords"
              description="Include top keywords: 'painting contractor', 'house painting'"
              priority="medium"
              impact="+12% relevance"
            />
            <TaskItem
              title="Add Q&A entries for common questions"
              description="Pre-fill FAQ to capture featured snippets"
              priority="medium"
              impact="+10% clicks"
            />
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-6">
          {/* AI Writer card */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-foreground">
              AI Writer
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate optimized posts, descriptions, and Q&A with AI.
            </p>
            <Link
              href="/dashboard/ai-writer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:bg-foreground/90"
            >
              Open AI Writer
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Run new audit */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold text-foreground">
              Run New Audit
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get fresh competitor data and keyword opportunities.
            </p>
            <Link
              href="/audit"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Start Audit
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Top keywords table preview */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Top Keywords
            </h2>
            <p className="text-sm text-muted-foreground">
              Your best performing keywords this month
            </p>
          </div>
          <Link
            href="/dashboard/keywords"
            className="text-xs font-medium text-primary hover:text-primary/80"
          >
            View all keywords
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  Keyword
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Volume
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  Your Rank
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  Competitor
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              <KeywordRow keyword="house painters near me" volume={1200} yourRank={3} compRank={1} trend="up" />
              <KeywordRow keyword="painting contractors" volume={880} yourRank={5} compRank={2} trend="stable" />
              <KeywordRow keyword="exterior house painting" volume={720} yourRank={4} compRank={3} trend="up" />
              <KeywordRow keyword="interior painting services" volume={590} yourRank={7} compRank={4} trend="down" />
              <KeywordRow keyword="commercial painters" volume={440} yourRank={6} compRank={5} trend="up" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  suffix,
  change,
  trend,
  href,
}: {
  label: string;
  value: string;
  suffix?: string;
  change: string;
  trend: "up" | "down";
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-border bg-card p-5 transition hover:border-muted-foreground/30"
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-foreground tabular-nums">
          {value}
        </span>
        {suffix && (
          <span className="text-sm text-muted-foreground">{suffix}</span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-1">
        {trend === "up" ? (
          <svg className="h-3.5 w-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        )}
        <span className={`text-xs font-medium ${trend === "up" ? "text-success" : "text-destructive"}`}>
          {change}
        </span>
        <span className="text-xs text-muted-foreground">vs last month</span>
      </div>
    </Link>
  );
}

function TaskItem({
  title,
  description,
  priority,
  impact,
}: {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  impact: string;
}) {
  return (
    <div className="flex items-start gap-4 px-6 py-4">
      <div className={`mt-0.5 h-2 w-2 rounded-full ${
        priority === "high" ? "bg-destructive" : priority === "medium" ? "bg-warning" : "bg-muted-foreground"
      }`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="shrink-0 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
        {impact}
      </span>
    </div>
  );
}

function KeywordRow({
  keyword,
  volume,
  yourRank,
  compRank,
  trend,
}: {
  keyword: string;
  volume: number;
  yourRank: number;
  compRank: number;
  trend: "up" | "down" | "stable";
}) {
  return (
    <tr className="border-b border-border/50 hover:bg-muted/30">
      <td className="px-6 py-3.5">
        <span className="font-medium text-foreground">{keyword}</span>
      </td>
      <td className="px-4 py-3.5 text-right tabular-nums text-muted-foreground">
        {volume.toLocaleString()}
      </td>
      <td className="px-4 py-3.5 text-center">
        <span className={`inline-flex min-w-[2rem] justify-center rounded-md px-1.5 py-0.5 text-xs font-bold ${
          yourRank <= 3 ? "bg-success/10 text-success" : yourRank <= 10 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
        }`}>
          #{yourRank}
        </span>
      </td>
      <td className="px-4 py-3.5 text-center">
        <span className="inline-flex min-w-[2rem] justify-center rounded-md bg-muted px-1.5 py-0.5 text-xs font-bold text-foreground">
          #{compRank}
        </span>
      </td>
      <td className="px-4 py-3.5 text-right">
        {trend === "up" && (
          <svg className="h-4 w-4 text-success ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        )}
        {trend === "down" && (
          <svg className="h-4 w-4 text-destructive ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        )}
        {trend === "stable" && (
          <svg className="h-4 w-4 text-muted-foreground ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
          </svg>
        )}
      </td>
    </tr>
  );
}
