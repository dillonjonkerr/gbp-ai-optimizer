import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">
          Overview of your Google Business Profile performance and next steps.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Profiles connected", value: "0", href: "/dashboard/profiles" },
          { label: "Optimization score", value: "—", href: "/dashboard/insights" },
          { label: "Reviews this month", value: "—", href: "/dashboard/insights" },
          { label: "Posts scheduled", value: "0", href: "/dashboard/posts" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm ring-1 ring-slate-900/5">
        <h2 className="text-lg font-semibold text-slate-900">
          Run a free audit
        </h2>
        <p className="mt-2 text-slate-600">
          Get a full local market scan, competitor comparison, and a
          step-by-step AI optimization plan for your Google Business Profile.
        </p>
        <Link
          href="/audit"
          className="mt-4 inline-block rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
        >
          Start Free Audit
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Get started</h2>
        <p className="mt-2 text-slate-600">
          Connect your first Google Business Profile to see AI-powered
          optimization suggestions, review insights, and post ideas.
        </p>
        <Link
          href="/dashboard/profiles"
          className="mt-4 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Connect a profile
        </Link>
      </div>
    </div>
  );
}
