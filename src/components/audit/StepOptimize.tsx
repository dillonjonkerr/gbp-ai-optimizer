"use client";

import { useState } from "react";
import {
  OPTIMIZATION_PHASES,
  type AuditResult,
  type BusinessInfo,
  type OptimizationPhase,
} from "@/lib/types";

function PhaseProfileBasics({ data }: { data: AuditResult["comparison"] }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Review and verify your core profile information. These are the
        foundations Google uses to rank your listing.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "Business Name", value: data.businessName },
          { label: "Address", value: data.address },
          { label: "Category", value: data.category },
          { label: "Phone", value: data.hasPhone ? "Listed" : "Add your phone number" },
          { label: "Website", value: data.hasWebsite ? "Listed" : "Add your website URL" },
          { label: "Rating", value: `${data.rating.toFixed(1)} / 5` },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-slate-200 bg-slate-50/50 p-4"
          >
            <p className="text-xs font-medium text-slate-500">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {item.value}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
        <p className="text-sm font-medium text-primary-800">
          Tip: Make sure your business name exactly matches your legal/branded
          name. Adding keywords to your name violates Google&apos;s guidelines.
        </p>
      </div>
    </div>
  );
}

function PhaseServices({ data }: { data: AuditResult }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Add every service you offer. Google uses these to match your listing to
        customer searches.
      </p>
      {data.recommendations
        .filter((r) => r.toLowerCase().includes("service"))
        .map((rec, i) => (
          <div
            key={i}
            className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4"
          >
            <span className="mt-0.5 text-primary-500">→</span>
            <span className="text-sm text-slate-700">{rec}</span>
          </div>
        ))}
      <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
        <p className="text-sm font-medium text-primary-800">
          Tip: Add at least 10 specific services with descriptions. Be
          detailed — &quot;Interior House Painting&quot; is better than just
          &quot;Painting&quot;.
        </p>
      </div>
    </div>
  );
}

function PhaseDescription({ data }: { data: AuditResult }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Your business description should be 750 characters, keyword-rich, and
        highlight what makes you different.
      </p>
      {data.recommendations
        .filter(
          (r) =>
            r.toLowerCase().includes("description") ||
            r.toLowerCase().includes("about"),
        )
        .map((rec, i) => (
          <div
            key={i}
            className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4"
          >
            <span className="mt-0.5 text-primary-500">→</span>
            <span className="text-sm text-slate-700">{rec}</span>
          </div>
        ))}
      <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
        <p className="text-sm font-medium text-primary-800">
          Tip: Include your city, services, and unique selling points in the
          first two sentences. Google gives these the most weight.
        </p>
      </div>
    </div>
  );
}

function PhaseReviews({ data }: { data: AuditResult }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        You have <strong>{data.comparison.reviewCount}</strong> reviews.
        Responding to every review signals trust to Google and future customers.
      </p>
      <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
        <p className="text-sm font-medium text-primary-800">
          Tip: Reply to every review (positive and negative) within 24 hours.
          Mention the service and location naturally in your response.
        </p>
      </div>
      {data.recommendations
        .filter((r) => r.toLowerCase().includes("review"))
        .map((rec, i) => (
          <div
            key={i}
            className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4"
          >
            <span className="mt-0.5 text-primary-500">→</span>
            <span className="text-sm text-slate-700">{rec}</span>
          </div>
        ))}
    </div>
  );
}

function PhaseQAPosts({ data }: { data: AuditResult }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Add pre-written Q&amp;A entries and start posting regularly to keep your
        profile active.
      </p>

      {data.suggestedQA.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700">
            Suggested Q&amp;A entries
          </h4>
          <div className="mt-3 space-y-3">
            {data.suggestedQA.map((qa, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 bg-slate-50/50 p-4"
              >
                <p className="text-sm font-semibold text-slate-800">
                  Q: {qa.question}
                </p>
                <p className="mt-1 text-sm text-slate-600">A: {qa.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.suggestedPosts.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700">
            Suggested post ideas
          </h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {data.suggestedPosts.map((post, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-700"
              >
                {post}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StepOptimize({
  result,
  businessInfo,
  onBack,
}: {
  result: AuditResult;
  businessInfo: BusinessInfo;
  onBack: () => void;
}) {
  const [activePhase, setActivePhase] = useState<OptimizationPhase>(
    "profile-basics",
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
          Step 5 of 5
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Optimize {businessInfo.businessName}
        </h1>
        <p className="mt-2 text-base text-slate-500">
          Follow each phase to fully optimize your Google Business Profile.
        </p>
      </div>

      {/* Phase nav */}
      <div className="flex flex-wrap gap-2">
        {OPTIMIZATION_PHASES.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setActivePhase(phase.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activePhase === phase.id
                ? "bg-primary-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {phase.label}
          </button>
        ))}
      </div>

      {/* Phase content */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8">
        <h2 className="text-lg font-semibold text-slate-900">
          {OPTIMIZATION_PHASES.find((p) => p.id === activePhase)?.label}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {OPTIMIZATION_PHASES.find((p) => p.id === activePhase)?.description}
        </p>
        <div className="mt-6">
          {activePhase === "profile-basics" && (
            <PhaseProfileBasics data={result.comparison} />
          )}
          {activePhase === "services" && <PhaseServices data={result} />}
          {activePhase === "description" && (
            <PhaseDescription data={result} />
          )}
          {activePhase === "reviews" && <PhaseReviews data={result} />}
          {activePhase === "qa-posts" && <PhaseQAPosts data={result} />}
        </div>
      </div>

      <div className="flex justify-start">
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
