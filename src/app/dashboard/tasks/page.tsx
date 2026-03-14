'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/v0-dashboard/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  Image,
  MessageSquare,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Clock,
  TrendingUp,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Task {
  id: string
  title: string
  description: string
  category: 'description' | 'photos' | 'posts' | 'qa' | 'services'
  impact: 'high' | 'medium' | 'low'
  estimatedTime: string
  completed: boolean
  aiAssisted: boolean
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Optimize business description',
    description: 'Your description is missing key service keywords. Add terms like "emergency plumber" and "24/7 service".',
    category: 'description',
    impact: 'high',
    estimatedTime: '10 min',
    completed: false,
    aiAssisted: true,
  },
  {
    id: '2',
    title: 'Add 10 more photos',
    description: 'Competitors average 45 photos. Add photos of recent jobs, team members, and equipment.',
    category: 'photos',
    impact: 'high',
    estimatedTime: '30 min',
    completed: false,
    aiAssisted: false,
  },
  {
    id: '3',
    title: 'Create weekly Google post',
    description: 'Share a recent project or promotion to boost engagement.',
    category: 'posts',
    impact: 'medium',
    estimatedTime: '15 min',
    completed: true,
    aiAssisted: true,
  },
  {
    id: '4',
    title: 'Add Q&A entries',
    description: 'Answer common customer questions proactively. Suggested: pricing, service areas, emergency availability.',
    category: 'qa',
    impact: 'medium',
    estimatedTime: '20 min',
    completed: false,
    aiAssisted: true,
  },
  {
    id: '5',
    title: 'Update services list',
    description: 'Add missing services: water heater installation, sewer line repair, gas line services.',
    category: 'services',
    impact: 'high',
    estimatedTime: '15 min',
    completed: false,
    aiAssisted: true,
  },
  {
    id: '6',
    title: 'Respond to recent reviews',
    description: '3 reviews in the past week need responses. Quick responses improve customer perception.',
    category: 'posts',
    impact: 'medium',
    estimatedTime: '10 min',
    completed: false,
    aiAssisted: true,
  },
]

const categoryIcons = {
  description: FileText,
  photos: Image,
  posts: MessageSquare,
  qa: HelpCircle,
  services: FileText,
}

const categoryLabels = {
  description: 'Description',
  photos: 'Photos',
  posts: 'Posts & Reviews',
  qa: 'Q&A',
  services: 'Services',
}

function ImpactBadge({ impact }: { impact: 'high' | 'medium' | 'low' }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        impact === 'high' && 'border-green-500/30 text-green-500 bg-green-500/10',
        impact === 'medium' && 'border-amber-500/30 text-amber-500 bg-amber-500/10',
        impact === 'low' && 'border-muted-foreground/30 text-muted-foreground'
      )}
    >
      <TrendingUp className="h-3 w-3 mr-1" />
      {impact} impact
    </Badge>
  )
}

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks)

  const completedCount = tasks.filter((t) => t.completed).length
  const totalCount = tasks.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    )
  }

  const pendingTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  return (
    <>
      <DashboardHeader
        title="Optimization Tasks"
        description="AI-recommended improvements for your profile"
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Progress Card */}
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Optimization Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    {completedCount} of {totalCount} tasks completed
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-primary">{progressPercent}%</span>
                </div>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </CardContent>
          </Card>

          {/* Tasks */}
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="bg-muted">
              <TabsTrigger value="pending" className="gap-2">
                <Circle className="h-4 w-4" />
                Pending ({pendingTasks.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Completed ({completedTasks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-3">
              {pendingTasks.map((task) => {
                const Icon = categoryIcons[task.category]
                return (
                  <Card
                    key={task.id}
                    className="border-border bg-card hover:border-primary/30 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id={task.id}
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <label
                                htmlFor={task.id}
                                className="text-base font-medium text-foreground cursor-pointer"
                              >
                                {task.title}
                              </label>
                              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            </div>
                            <ImpactBadge impact={task.impact} />
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Icon className="h-4 w-4" />
                              {categoryLabels[task.category]}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {task.estimatedTime}
                            </span>
                            {task.aiAssisted && (
                              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                <Sparkles className="h-3 w-3 text-primary" />
                                AI Assist
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>

            <TabsContent value="completed" className="space-y-3">
              {completedTasks.map((task) => {
                const Icon = categoryIcons[task.category]
                return (
                  <Card key={task.id} className="border-border bg-card/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id={task.id}
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <label
                                htmlFor={task.id}
                                className="text-base font-medium text-muted-foreground line-through cursor-pointer"
                              >
                                {task.title}
                              </label>
                            </div>
                            <Badge variant="outline" className="text-green-500 border-green-500/30">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Done
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Icon className="h-4 w-4" />
                              {categoryLabels[task.category]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}
