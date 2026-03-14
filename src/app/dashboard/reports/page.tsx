'use client'

import { DashboardHeader } from '@/components/v0-dashboard/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Download, FileText, TrendingUp, Eye, Share2 } from 'lucide-react'

const reports = [
  {
    title: 'Weekly Performance Report',
    description: 'Visibility score, keyword rankings, and competitor analysis',
    date: 'March 10, 2026',
    type: 'Performance',
    status: 'ready',
  },
  {
    title: 'Monthly SEO Analysis',
    description: 'Detailed keyword opportunities and optimization recommendations',
    date: 'March 1, 2026',
    type: 'SEO',
    status: 'ready',
  },
  {
    title: 'Competitor Benchmark Report',
    description: 'How you stack up against top 5 local competitors',
    date: 'February 28, 2026',
    type: 'Competitor',
    status: 'ready',
  },
  {
    title: 'Q1 2026 Summary',
    description: 'Quarterly performance overview and growth metrics',
    date: 'Generating...',
    type: 'Quarterly',
    status: 'generating',
  },
]

export default function ReportsPage() {
  return (
    <>
      <DashboardHeader
        title="Reports"
        description="Download detailed performance reports"
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Visibility Trend</p>
                  <p className="text-lg font-semibold text-green-500">+18% this month</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profile Views</p>
                  <p className="text-lg font-semibold text-foreground">2,847 this week</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reports Generated</p>
                  <p className="text-lg font-semibold text-foreground">12 total</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports List */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Available Reports</CardTitle>
                  <CardDescription>Download or share your performance reports</CardDescription>
                </div>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate New Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {reports.map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-foreground">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {report.date}
                        </span>
                        <Badge variant="outline">{report.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.status === 'ready' ? (
                      <>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </>
                    ) : (
                      <Badge variant="secondary">Generating...</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Schedule Reports */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Scheduled Reports</CardTitle>
              <CardDescription>Automatically generate and send reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <h3 className="font-medium text-foreground">Weekly Performance Summary</h3>
                    <p className="text-sm text-muted-foreground">Every Monday at 9:00 AM</p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/30">Active</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <h3 className="font-medium text-foreground">Monthly SEO Report</h3>
                    <p className="text-sm text-muted-foreground">1st of every month</p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/30">Active</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  + Add Scheduled Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
