"use client";

import { useState } from "react";
import {
  Building2,
  Plus,
  MapPin,
  Star,
  Phone,
  Globe,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";

const mockProfiles = [
  {
    id: 1,
    name: "Smith HVAC Services",
    address: "123 Main Street, Austin, TX 78701",
    phone: "(555) 123-4567",
    website: "smithhvac.com",
    rating: 4.8,
    reviews: 127,
    status: "verified",
    completeness: 85,
    visibility: "+12%",
  },
  {
    id: 2,
    name: "Smith Plumbing Co",
    address: "456 Oak Avenue, Austin, TX 78702",
    phone: "(555) 987-6543",
    website: "smithplumbing.com",
    rating: 4.5,
    reviews: 89,
    status: "pending",
    completeness: 60,
    visibility: "-",
  },
];

export default function ProfilesPage() {
  const [profiles] = useState(mockProfiles);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Profiles</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your connected Google Business Profiles.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Connect Profile
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Profiles</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{profiles.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Avg. Rating</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {(profiles.reduce((acc, p) => acc + p.rating, 0) / profiles.length).toFixed(1)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Reviews</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {profiles.reduce((acc, p) => acc + p.reviews, 0)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Avg. Completeness</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {Math.round(profiles.reduce((acc, p) => acc + p.completeness, 0) / profiles.length)}%
          </p>
        </div>
      </div>

      {/* Profiles List */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground">Connected Profiles</h2>
        <div className="space-y-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{profile.name}</h3>
                      {profile.status === "verified" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                          <AlertCircle className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {profile.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {profile.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" />
                        {profile.website}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="text-sm font-medium text-foreground">{profile.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({profile.reviews} reviews)
                        </span>
                      </div>
                      <div className="h-4 w-px bg-border" />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Completeness:</span>
                        <div className="h-2 w-24 rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${profile.completeness}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {profile.completeness}%
                        </span>
                      </div>
                      {profile.visibility !== "-" && (
                        <>
                          <div className="h-4 w-px bg-border" />
                          <span className="flex items-center gap-1 text-sm text-success">
                            <TrendingUp className="h-3.5 w-3.5" />
                            {profile.visibility} visibility
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {profiles.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">No profiles connected</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect your Google Business Profile to get started.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Connect Profile
          </button>
        </div>
      )}
    </div>
  );
}
