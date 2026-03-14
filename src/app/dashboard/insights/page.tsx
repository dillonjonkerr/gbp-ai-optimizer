"use client";

import { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
} from "lucide-react";

const mockInsights = [
  {
    id: 1,
    type: "keyword",
    priority: "high",
    title: "Add 'emergency' to your services",
    description:
      "Competitors ranking for 'emergency plumber near me' - you're missing this high-intent keyword.",
    impact: "+45% potential visibility",
    status: "pending",
  },
  {
    id: 2,
    type: "content",
    priority: "high",
    title: "Update business description",
    description:
      "Your description is 120 characters. Optimal length is 750+ characters with keywords.",
    impact: "+30% profile completeness",
    status: "pending",
  },
  {
    id: 3,
    type: "photos",
    priority: "medium",
    title: "Add more photos",
    description:
      "You have 5 photos. Top competitors average 25+ photos. Add team, work, and location photos.",
    impact: "+2x engagement",
    status: "pending",
  },
  {
    id: 4,
    type: "reviews",
    priority: "medium",
    title: "Respond to recent reviews",
    description: "3 reviews from the past week need responses. Quick responses improve rankings.",
    impact: "+15% trust signals",
    status: "completed",
  },
];

const priorityStyles = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-muted text-muted-foreground border-border",
};

export default function InsightsPage() {
  const [insights] = useState(mockInsights);
  const pendingCount = insights.filter((i) => i.status === "pending").length;
  const completedCount = insights.filter((i) => i.status === "completed").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">AI Insights</h1>
        <p className="mt-1 text-muted-foreground">
          Personalized recommendations to improve your local search performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">{insights.length}</p>
              <p className="text-sm text-muted-foreground">Total Insights</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending Actions</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">{completedCount}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Card */}
      <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-6">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">AI Analysis Summary</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Based on your profile analysis, implementing the top 3 recommendations could increase
              your local search visibility by approximately <span className="text-primary font-medium">67%</span>. 
              Focus on adding emergency keywords and expanding your business description first.
            </p>
            <button className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              View detailed report
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground">Recommendations</h2>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`group rounded-xl border bg-card p-5 transition-all hover:border-primary/30 ${
                insight.status === "completed" ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                      insight.status === "completed"
                        ? "bg-success/10"
                        : "bg-primary/10"
                    }`}
                  >
                    {insight.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : insight.type === "keyword" ? (
                      <Target className="h-5 w-5 text-primary" />
                    ) : insight.type === "content" ? (
                      <Zap className="h-5 w-5 text-primary" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{insight.title}</h3>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                          priorityStyles[insight.priority as keyof typeof priorityStyles]
                        }`}
                      >
                        {insight.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
                    <p className="mt-2 text-sm font-medium text-success">{insight.impact}</p>
                  </div>
                </div>
                {insight.status === "pending" && (
                  <button className="flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-primary/90">
                    Apply
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
