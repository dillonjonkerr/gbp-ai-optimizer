"use client";

import { useState } from "react";
import {
  Sparkles,
  Plus,
  Calendar,
  Image as ImageIcon,
  Send,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Eye,
  ThumbsUp,
} from "lucide-react";

const mockPosts = [
  {
    id: 1,
    content:
      "Spring is here! Time to get your HVAC system checked before the summer heat arrives. Book your maintenance appointment today and save 15%!",
    status: "published",
    date: "Mar 10, 2026",
    views: 234,
    engagement: 12,
  },
  {
    id: 2,
    content:
      "We're excited to announce our new 24/7 emergency service! No matter when you need us, we'll be there. Call us anytime at (555) 123-4567.",
    status: "scheduled",
    date: "Mar 18, 2026",
    views: 0,
    engagement: 0,
  },
  {
    id: 3,
    content:
      "Thank you to all our amazing customers for making us the #1 rated HVAC company in the area! We couldn't do it without your trust and support.",
    status: "draft",
    date: "",
    views: 0,
    engagement: 0,
  },
];

const statusStyles = {
  published: { bg: "bg-success/10", text: "text-success", label: "Published" },
  scheduled: { bg: "bg-primary/10", text: "text-primary", label: "Scheduled" },
  draft: { bg: "bg-muted", text: "text-muted-foreground", label: "Draft" },
};

export default function PostsPage() {
  const [posts] = useState(mockPosts);
  const [showComposer, setShowComposer] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Posts</h1>
          <p className="mt-1 text-muted-foreground">
            Create and schedule Google Business Profile posts.
          </p>
        </div>
        <button
          onClick={() => setShowComposer(!showComposer)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Post
        </button>
      </div>

      {/* AI Composer */}
      {showComposer && (
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Post Generator</h3>
              <p className="text-sm text-muted-foreground">
                Describe what you want to post about
              </p>
            </div>
          </div>
          <textarea
            placeholder="E.g., Announce our spring cleaning special with 20% off..."
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            rows={3}
          />
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <ImageIcon className="h-4 w-4" />
                Add Image
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Calendar className="h-4 w-4" />
                Schedule
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                <Sparkles className="h-4 w-4" />
                Generate with AI
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                <Send className="h-4 w-4" />
                Post Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {posts.filter((p) => p.status === "published").length}
              </p>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {posts.filter((p) => p.status === "scheduled").length}
              </p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Eye className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {posts.reduce((acc, p) => acc + p.views, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground">Recent Posts</h2>
        <div className="space-y-3">
          {posts.map((post) => {
            const status = statusStyles[post.status as keyof typeof statusStyles];
            return (
              <div
                key={post.id}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}
                      >
                        {status.label}
                      </span>
                      {post.date && (
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                      )}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
                    {post.status === "published" && (
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {post.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          {post.engagement} engagements
                        </span>
                      </div>
                    )}
                  </div>
                  <button className="flex-shrink-0 rounded-lg p-2 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
