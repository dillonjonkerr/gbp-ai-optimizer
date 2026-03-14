'use client'

import { DashboardHeader } from '@/components/v0-dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star, Image as ImageIcon, FileText, Target, ExternalLink, TrendingUp, TrendingDown, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

const competitors = [
  {
    name: 'Pro Plumbers LLC',
    rating: 4.9,
    reviews: 287,
    photos: 65,
    keywordOverlap: 78,
    visibilityScore: 92,
    trend: 'up',
    initials: 'PP',
  },
  {
    name: 'Quick Fix Plumbing',
    rating: 4.7,
    reviews: 156,
    photos: 42,
    keywordOverlap: 65,
    visibilityScore: 85,
    trend: 'stable',
    initials: 'QF',
  },
  {
    name: 'City Plumbing Services',
    rating: 4.6,
    reviews: 203,
    photos: 38,
    keywordOverlap: 72,
    visibilityScore: 79,
    trend: 'down',
    initials: 'CP',
  },
  {
    name: 'Express Drain Solutions',
    rating: 4.5,
    reviews: 98,
    photos: 28,
    keywordOverlap: 54,
    visibilityScore: 71,
    trend: 'up',
    initials: 'ED',
  },
  {
    name: '24/7 Emergency Plumber',
    rating: 4.4,
    reviews: 124,
    photos: 22,
    keywordOverlap: 61,
    visibilityScore: 68,
    trend: 'stable',
    initials: '24',
  },
]

// Your business data for comparison
const yourBusiness = {
  rating: 4.2,
  reviews: 45,
  photos: 18,
  keywordCoverage: 42,
  visibilityScore: 72,
}

function TrendBadge({ trend }: { trend: string }) {
  if (trend === 'up') {
    return (
      <Badge variant="outline" className="text-green-500 border-green-500/30">
        <TrendingUp className="h-3 w-3 mr-1" />
        Rising
      </Badge>
    )
  }
  if (trend === 'down') {
    return (
      <Badge variant="outline" className="text-red-500 border-red-500/30">
        <TrendingDown className="h-3 w-3 mr-1" />
        Falling
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      Stable
    </Badge>
  )
}

export default function CompetitorsPage() {
  return (
    <>
      <DashboardHeader
        title="Competitors"
        description="Analyze your top local competitors"
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Your Position Card */}
          <Card className="border-primary/50 bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Your Position</CardTitle>
                <Badge className="bg-primary">You</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-5">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Star className="h-4 w-4" /> Rating
                  </p>
                  <p className="text-2xl font-bold text-foreground">{yourBusiness.rating}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <FileText className="h-4 w-4" /> Reviews
                  </p>
                  <p className="text-2xl font-bold text-foreground">{yourBusiness.reviews}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" /> Photos
                  </p>
                  <p className="text-2xl font-bold text-foreground">{yourBusiness.photos}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Target className="h-4 w-4" /> Keywords
                  </p>
                  <p className="text-2xl font-bold text-foreground">{yourBusiness.keywordCoverage}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="h-4 w-4" /> Visibility
                  </p>
                  <p className="text-2xl font-bold text-primary">{yourBusiness.visibilityScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitors Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {competitors.map((competitor, index) => (
              <Card key={index} className="border-border bg-card hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                            {competitor.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{competitor.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            {competitor.rating}
                          </div>
                        </div>
                      </div>
                      <TrendBadge trend={competitor.trend} />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Reviews</p>
                        <p className="font-semibold text-foreground">{competitor.reviews}</p>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              competitor.reviews > yourBusiness.reviews ? 'bg-red-500' : 'bg-green-500'
                            )}
                            style={{ width: `${Math.min((yourBusiness.reviews / competitor.reviews) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Photos</p>
                        <p className="font-semibold text-foreground">{competitor.photos}</p>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              competitor.photos > yourBusiness.photos ? 'bg-red-500' : 'bg-green-500'
                            )}
                            style={{ width: `${Math.min((yourBusiness.photos / competitor.photos) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Keyword Overlap */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Keyword Overlap</span>
                        <span className="font-medium text-foreground">{competitor.keywordOverlap}%</span>
                      </div>
                      <Progress value={competitor.keywordOverlap} className="h-2" />
                    </div>

                    {/* Visibility Score */}
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <span className="text-sm text-muted-foreground">Visibility Score</span>
                      <span
                        className={cn(
                          'text-lg font-bold',
                          competitor.visibilityScore > yourBusiness.visibilityScore
                            ? 'text-red-500'
                            : 'text-green-500'
                        )}
                      >
                        {competitor.visibilityScore}
                      </span>
                    </div>

                    {/* Actions */}
                    <Button variant="outline" className="w-full" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
