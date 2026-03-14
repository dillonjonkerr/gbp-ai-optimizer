'use client'

import { DashboardHeader } from '@/components/v0-dashboard/header'
import { MetricCard } from '@/components/v0-dashboard/metric-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Eye, Search, Users, TrendingDown, ArrowRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'

const recentTasks = [
  { title: 'Update business description', status: 'completed', impact: 'high' },
  { title: 'Add 5 new photos', status: 'in-progress', impact: 'medium' },
  { title: 'Respond to recent reviews', status: 'pending', impact: 'high' },
  { title: 'Add Q&A section', status: 'pending', impact: 'medium' },
]

const topKeywords = [
  { keyword: 'plumber near me', rank: 3, volume: 2400, trend: 'up' },
  { keyword: 'emergency plumber', rank: 7, volume: 1800, trend: 'down' },
  { keyword: '24 hour plumber', rank: 12, volume: 1200, trend: 'up' },
  { keyword: 'local plumber', rank: 5, volume: 980, trend: 'stable' },
]

export default function DashboardOverview() {
  return (
    <>
      <DashboardHeader 
        title="Overview" 
        description="Your Google Business Profile performance at a glance"
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Visibility Score"
              value="72"
              change={8}
              changeLabel="vs last month"
              icon={Eye}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            <MetricCard
              title="Keywords Ranked"
              value="45"
              change={12}
              changeLabel="vs last month"
              icon={Search}
              iconColor="text-green-500"
              iconBgColor="bg-green-500/10"
            />
            <MetricCard
              title="Competitor Gap"
              value="23"
              change={-5}
              changeLabel="keywords behind"
              icon={Users}
              iconColor="text-amber-500"
              iconBgColor="bg-amber-500/10"
            />
            <MetricCard
              title="Missed Traffic"
              value="2.8K"
              change={-15}
              changeLabel="vs last month"
              icon={TrendingDown}
              iconColor="text-red-500"
              iconBgColor="bg-red-500/10"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Optimization Tasks */}
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold">Optimization Tasks</CardTitle>
                  <CardDescription>AI-recommended improvements</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full',
                          task.status === 'completed' && 'bg-green-500/10',
                          task.status === 'in-progress' && 'bg-amber-500/10',
                          task.status === 'pending' && 'bg-muted'
                        )}
                      >
                        {task.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        {task.status === 'in-progress' && <Clock className="h-4 w-4 text-amber-500" />}
                        {task.status === 'pending' && <AlertTriangle className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <span className="text-sm font-medium text-foreground">{task.title}</span>
                    </div>
                    <Badge
                      variant={task.impact === 'high' ? 'default' : 'secondary'}
                      className={task.impact === 'high' ? 'bg-primary' : ''}
                    >
                      {task.impact} impact
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Keywords */}
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold">Top Keywords</CardTitle>
                  <CardDescription>Your best performing search terms</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topKeywords.map((kw, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{kw.keyword}</span>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-muted-foreground">{kw.volume.toLocaleString()} /mo</span>
                          <Badge variant="outline" className="font-mono">
                            #{kw.rank}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={((10 - Math.min(kw.rank, 10)) / 10) * 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Completeness */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Profile Completeness</CardTitle>
              <CardDescription>Optimize your profile to improve visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">78%</span>
                  <span className="text-sm text-muted-foreground">22% to go</span>
                </div>
                <Progress value={78} className="h-3" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Basic Info', status: 'complete' },
                    { label: 'Photos', status: 'partial' },
                    { label: 'Services', status: 'partial' },
                    { label: 'Q&A', status: 'missing' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-3"
                    >
                      <div
                        className={cn(
                          'h-2 w-2 rounded-full',
                          item.status === 'complete' && 'bg-green-500',
                          item.status === 'partial' && 'bg-amber-500',
                          item.status === 'missing' && 'bg-red-500'
                        )}
                      />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
