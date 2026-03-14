'use client'

import { DashboardHeader } from '@/components/v0-dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, TrendingUp, TrendingDown, Minus, ArrowUpDown, Download, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

const keywords = [
  { keyword: 'plumber near me', volume: 2400, yourRank: 3, competitorRank: 1, trend: 'up', change: 2 },
  { keyword: 'emergency plumber', volume: 1800, yourRank: 7, competitorRank: 2, trend: 'down', change: -3 },
  { keyword: '24 hour plumber', volume: 1200, yourRank: 12, competitorRank: 5, trend: 'up', change: 4 },
  { keyword: 'local plumber', volume: 980, yourRank: 5, competitorRank: 3, trend: 'stable', change: 0 },
  { keyword: 'plumbing services', volume: 880, yourRank: 8, competitorRank: 4, trend: 'up', change: 1 },
  { keyword: 'drain cleaning', volume: 720, yourRank: 15, competitorRank: 6, trend: 'down', change: -2 },
  { keyword: 'water heater repair', volume: 650, yourRank: 6, competitorRank: 8, trend: 'up', change: 5 },
  { keyword: 'leak repair', volume: 540, yourRank: 9, competitorRank: 7, trend: 'stable', change: 0 },
  { keyword: 'pipe repair', volume: 480, yourRank: 11, competitorRank: 9, trend: 'up', change: 2 },
  { keyword: 'bathroom plumber', volume: 420, yourRank: 14, competitorRank: 11, trend: 'down', change: -1 },
]

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />
  return <Minus className="h-4 w-4 text-muted-foreground" />
}

function RankBadge({ rank, isYours = false }: { rank: number; isYours?: boolean }) {
  const color = rank <= 3 ? 'bg-green-500/10 text-green-500' : 
                rank <= 10 ? 'bg-amber-500/10 text-amber-500' : 
                'bg-red-500/10 text-red-500'
  return (
    <Badge variant="outline" className={cn('font-mono', isYours && color)}>
      #{rank}
    </Badge>
  )
}

export default function KeywordsPage() {
  return (
    <>
      <DashboardHeader
        title="Keyword Rankings"
        description="Track your position for local search keywords"
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Keywords</p>
                <p className="text-2xl font-bold text-foreground">45</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Top 3 Rankings</p>
                <p className="text-2xl font-bold text-green-500">8</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Top 10 Rankings</p>
                <p className="text-2xl font-bold text-amber-500">23</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Avg. Position</p>
                <p className="text-2xl font-bold text-foreground">7.2</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters & Search */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg font-semibold">All Keywords</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search keywords..." className="w-full pl-9 sm:w-64" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="top3">Top 3</SelectItem>
                      <SelectItem value="top10">Top 10</SelectItem>
                      <SelectItem value="improving">Improving</SelectItem>
                      <SelectItem value="declining">Declining</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold">
                        <Button variant="ghost" size="sm" className="h-8 px-2 -ml-2">
                          Keyword
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          Search Volume
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="font-semibold text-center">Your Rank</TableHead>
                      <TableHead className="font-semibold text-center">Competitor Rank</TableHead>
                      <TableHead className="font-semibold text-center">Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keywords.map((kw, index) => (
                      <TableRow key={index} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{kw.keyword}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {kw.volume.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <RankBadge rank={kw.yourRank} isYours />
                        </TableCell>
                        <TableCell className="text-center">
                          <RankBadge rank={kw.competitorRank} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <TrendIcon trend={kw.trend} />
                            <span
                              className={cn(
                                'text-sm font-medium',
                                kw.change > 0 && 'text-green-500',
                                kw.change < 0 && 'text-red-500',
                                kw.change === 0 && 'text-muted-foreground'
                              )}
                            >
                              {kw.change > 0 && '+'}
                              {kw.change}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
