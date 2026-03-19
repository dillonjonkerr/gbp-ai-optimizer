'use client'

/* Logic Editor — Mermaid diagram viewer + comment sidebar
   Zoom/pan on diagram. Run spawns a dedicated AI agent that classifies
   each task and routes it to the best model (Claude Opus, Sonnet, GPT-4o, etc.) */

import { useEffect, useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare, Save, Loader2, Play, ZoomIn, ZoomOut,
  RotateCcw, CheckCircle, XCircle, SkipForward, Brain,
  Sparkles, AlertCircle,
} from 'lucide-react'
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch'
import { cn } from '@/lib/utils'

const NODE_DESCRIPTIONS: Record<string, string> = {
  U1: 'User opens the page', U2: 'Types their business name',
  U3: 'Google suggests matching businesses', U4: 'Picks their business from the list',
  U5: 'Hits the scan button', U6: 'Business name + city + website sent to scan engine',
  S1: 'Loading screen appears', S2: 'Progress bar fills up, stops at 90%',
  S3: 'Discovery messages appear one by one',
  A1: 'Scan starts on the server', A2: 'Too many scans? (3 per hour max)',
  E1: "Error: 'Try again later'", E2: "Error: 'Business not found'",
  G1: 'Search Google for the business', G2: 'Get the Google listing ID',
  G3: 'Pull full business details', G4: 'Save as profile',
  P1: 'Two jobs run at the same time',
  O1: 'AI reads the profile data', O2: 'AI scores it 0-100',
  O3: 'AI writes visibility score, summary, opportunities',
  K1: 'Create 5 basic search terms',
  K2: 'Ask DataForSEO: what do people search?',
  K3: 'Does the business have a website?',
  K4: 'Ask DataForSEO: keywords for website',
  K5: 'Skip, use keywords we have', K6: 'Combine all keywords',
  V1: 'Get monthly search counts', V2: 'Got data for most keywords?',
  V3: 'Try state-level data', V4: 'Got data now?',
  V5: 'Pick top 10 keywords', V6: 'Try national data or estimates',
  R1: 'Google each of the 10 keywords', R2: 'Where does business rank?',
  R3: 'Tally businesses in results', R4: '#1 competitor = ranks highest most often',
  R5: 'Keywords where competitor beats you', R6: 'Estimate clicks lost',
  R7: 'Total: gap keywords, competitor, missed clicks',
  C1: 'Find competitor on Google', C2: 'Search competitor by name',
  C3: "Search 'best painter in Sandy UT'", C4: 'Placeholder with better stats',
  C5: 'Competitor profile ready',
  F1: 'Bundle everything together', F2: 'Profile vs competitor, gap keywords',
  F3: 'AI score, summary, opportunities', F4: 'Post ideas, Q&A suggestions',
  F5: 'Send to browser',
  T1: 'Progress bar 100%, flip to results',
  D1: 'RESULTS PAGE', D2: "Headline: 'You're invisible for X of Y keywords'",
  D3: 'Missed calls card', D4: 'Visibility score circle',
  D5: 'You vs Competitor side by side', D6: "Biggest keyword you're missing",
  D7: 'AI summary paragraph', D8: "'Show Me How to Fix This' button",
  D9: 'Choice page: DIY or AI Optimization',
}

const MODEL_COLORS: Record<string, string> = {
  'Claude Opus':  'bg-purple-100 text-purple-800 border-purple-300',
  'Claude Sonnet': 'bg-violet-100 text-violet-800 border-violet-300',
  'GPT-4o':       'bg-emerald-100 text-emerald-800 border-emerald-300',
  'GPT-4o Mini':  'bg-sky-100 text-sky-800 border-sky-300',
}

type CommentsMap = Record<string, string[]>

interface AgentTask {
  code: string
  taskType: string
  model: string
  modelLabel: string
  reasoning: string
  comments: string[]
  files: string[]
}

interface TaskProgress {
  file: string
  nodes: string
  model: string
  modelLabel: string
  reason?: string
  status?: 'applied' | 'skipped' | 'error'
  error?: string
}

function ZoomControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls()
  return (
    <div className="absolute top-2 left-2 z-10 flex gap-1 bg-background/90 backdrop-blur rounded-md border border-border p-1 shadow-sm">
      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => zoomIn()}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => zoomOut()}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => resetTransform()}>
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  )
}

function ModelBadge({ label }: { label: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border', MODEL_COLORS[label] ?? 'bg-gray-100 text-gray-800 border-gray-300')}>
      <Brain className="h-3 w-3" />
      {label}
    </span>
  )
}

export default function LogicEditorPage() {
  const [diagramContent, setDiagramContent] = useState('')
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [comments, setComments] = useState<CommentsMap>({})
  const [newComment, setNewComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Agent state
  const [agentRunning, setAgentRunning] = useState(false)
  const [agentPlan, setAgentPlan] = useState<AgentTask[] | null>(null)
  const [agentProgress, setAgentProgress] = useState<TaskProgress[]>([])
  const [agentDone, setAgentDone] = useState<{ success: boolean; message: string } | null>(null)

  const totalComments = Object.values(comments).flat().length

  useEffect(() => {
    fetch('/api/logic-diagram')
      .then((r) => r.text())
      .then(setDiagramContent)
      .catch(() => setDiagramContent(''))
  }, [])

  const loadComments = useCallback(() => {
    fetch('/api/logic-comments')
      .then((r) => r.json())
      .then(setComments)
      .catch(() => setComments({}))
  }, [])

  useEffect(() => { loadComments() }, [loadComments])

  useEffect(() => {
    if (!diagramContent) { setLoading(false); return }
    import('mermaid').then((mermaid) => {
      mermaid.default.initialize({
        startOnLoad: false,
        flowchart: { useMaxWidth: true, htmlLabels: true },
        securityLevel: 'loose',
      })
      const container = containerRef.current
      if (!container) return
      container.innerHTML = ''
      const el = document.createElement('div')
      el.id = 'logic-flow-diagram'
      el.className = 'mermaid'
      el.textContent = diagramContent
      container.appendChild(el)
      mermaid.default.run({ nodes: [el], suppressErrors: true }).then(() => {
        setLoading(false)
        container.querySelectorAll('g.node').forEach((g) => {
          const idAttr = g.id || ''
          let code: string | null = idAttr.match(/-([A-Z][0-9]+)(?:-|$)/)?.[1] ?? null
          if (!code) {
            const m = (g.textContent || '').match(/^([A-Z][0-9]+)\s/)
            code = m ? m[1] : null
          }
          if (!code) return
          ;(g as SVGGElement).style.cursor = 'pointer'
          g.addEventListener('click', () => setSelectedCode(code!))
        })
      }).catch(() => setLoading(false))
    })
  }, [diagramContent])

  // SSE-based agent run
  const handleRun = useCallback(() => {
    if (totalComments === 0 || agentRunning) return
    setAgentRunning(true)
    setAgentPlan(null)
    setAgentProgress([])
    setAgentDone(null)

    const evtSource = new EventSource('/api/logic-editor/run')

    evtSource.addEventListener('plan', (e) => {
      const data = JSON.parse(e.data)
      setAgentPlan(data.tasks)
    })

    evtSource.addEventListener('task-start', (e) => {
      const data = JSON.parse(e.data)
      setAgentProgress((prev) => [...prev, { ...data, status: undefined }])
    })

    evtSource.addEventListener('task-done', (e) => {
      const data = JSON.parse(e.data)
      setAgentProgress((prev) =>
        prev.map((p) => (p.file === data.file && !p.status ? { ...p, ...data } : p))
      )
    })

    evtSource.addEventListener('done', (e) => {
      const data = JSON.parse(e.data)
      setAgentDone({ success: data.success, message: data.message })
      setAgentRunning(false)
      loadComments()
      evtSource.close()
    })

    evtSource.addEventListener('error', (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data)
        setAgentDone({ success: false, message: data.message })
      } catch {
        setAgentDone({ success: false, message: 'Agent connection lost' })
      }
      setAgentRunning(false)
      evtSource.close()
    })

    evtSource.onerror = () => {
      setAgentDone({ success: false, message: 'Agent connection lost' })
      setAgentRunning(false)
      evtSource.close()
    }
  }, [totalComments, agentRunning, loadComments])

  const handleSaveComment = async () => {
    if (!selectedCode || !newComment.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/logic-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: selectedCode, comment: newComment.trim() }),
      })
      if (res.ok) {
        setComments(await res.json())
        setNewComment('')
      }
    } finally { setSaving(false) }
  }

  const selectedComments = selectedCode ? (comments[selectedCode] ?? []) : []
  const selectedDesc = selectedCode ? NODE_DESCRIPTIONS[selectedCode] ?? selectedCode : null

  // SSE uses GET — we need POST. Use fetch with reader instead.
  const handleRunFetch = useCallback(async () => {
    if (totalComments === 0 || agentRunning) return
    setAgentRunning(true)
    setAgentPlan(null)
    setAgentProgress([])
    setAgentDone(null)

    try {
      const res = await fetch('/api/logic-editor/run', { method: 'POST' })
      if (!res.body) throw new Error('No response body')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        let currentEvent = ''
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7)
          } else if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            if (currentEvent === 'plan') setAgentPlan(data.tasks)
            else if (currentEvent === 'task-start') setAgentProgress((prev) => [...prev, { ...data, status: undefined }])
            else if (currentEvent === 'task-done') setAgentProgress((prev) => prev.map((p) => (p.file === data.file && !p.status ? { ...p, ...data } : p)))
            else if (currentEvent === 'done') { setAgentDone({ success: data.success, message: data.message }); loadComments() }
            else if (currentEvent === 'error') setAgentDone({ success: false, message: data.message })
          }
        }
      }
    } catch (err) {
      setAgentDone({ success: false, message: err instanceof Error ? err.message : 'Agent failed' })
    } finally {
      setAgentRunning(false)
    }
  }, [totalComments, agentRunning, loadComments])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Logic Editor
          </h1>
          <p className="text-sm text-muted-foreground">
            Click nodes to comment. Run spawns an AI agent that picks the best model for each task.
          </p>
        </div>
        <Button onClick={handleRunFetch} disabled={totalComments === 0 || agentRunning} size="lg" className="shrink-0 gap-2">
          {agentRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Run Agent ({totalComments})
        </Button>
      </header>

      {/* Agent panel — shown when running or just finished */}
      {(agentPlan || agentRunning || agentDone) && (
        <div className="border-b border-border bg-muted/30 px-4 py-3 space-y-3 max-h-72 overflow-y-auto">
          {agentPlan && !agentRunning && !agentDone && (
            <div className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" /> Agent planning...
            </div>
          )}

          {/* Task plan + routing decisions */}
          {agentPlan && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Task routing</p>
              {agentPlan.map((t) => (
                <div key={t.code} className="flex items-start gap-2 text-sm py-1">
                  <span className="font-mono font-bold text-primary w-8 shrink-0">{t.code}</span>
                  <ModelBadge label={t.modelLabel} />
                  <span className="text-muted-foreground text-xs">{t.reasoning}</span>
                </div>
              ))}
            </div>
          )}

          {/* Live progress */}
          {agentProgress.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Progress</p>
              {agentProgress.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm py-1">
                  {!p.status && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />}
                  {p.status === 'applied' && <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" />}
                  {p.status === 'skipped' && <SkipForward className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                  {p.status === 'error' && <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                  <span className="font-mono text-xs">{p.nodes}</span>
                  <ModelBadge label={p.modelLabel} />
                  <span className="text-muted-foreground text-xs truncate">{p.file}</span>
                  {p.status === 'error' && <span className="text-red-500 text-xs">{p.error}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Done banner */}
          {agentDone && (
            <div className={cn(
              'flex items-center gap-2 text-sm font-medium rounded-md px-3 py-2',
              agentDone.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            )}>
              {agentDone.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {agentDone.message}
            </div>
          )}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Diagram */}
        <div className="flex-1 overflow-hidden border-r border-border relative">
          <TransformWrapper initialScale={0.8} minScale={0.3} maxScale={3} centerOnInit limitToBounds={false}>
            <ZoomControls />
            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="!w-full !h-full flex items-center justify-center min-h-[500px] p-8"
            >
              <div ref={containerRef} className="min-w-[600px]" />
            </TransformComponent>
          </TransformWrapper>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20 pointer-events-none">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading diagram...
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <aside className="w-80 flex flex-col bg-muted/30">
          <div className="p-4 border-b border-border">
            <h2 className="font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Comments
            </h2>
            {selectedCode ? (
              <div className="mt-3 text-sm">
                <span className="font-mono font-bold text-primary">{selectedCode}</span>
                {selectedDesc && <p className="text-muted-foreground mt-1">{selectedDesc}</p>}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">Click a node to add or view comments.</p>
            )}
          </div>

          {/* All comments summary */}
          {totalComments > 0 && !selectedCode && (
            <div className="p-4 border-b border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Pending ({totalComments})
              </p>
              <ScrollArea className="max-h-48">
                <ul className="space-y-1.5">
                  {Object.entries(comments).filter(([, arr]) => arr.length > 0).map(([code, arr]) => (
                    <li key={code}>
                      <button onClick={() => setSelectedCode(code)} className="text-left w-full hover:bg-background rounded-md p-1.5 transition-colors">
                        <span className="font-mono font-bold text-primary text-xs">{code}</span>
                        <span className="text-muted-foreground text-xs ml-2">{arr.length} comment{arr.length > 1 ? 's' : ''}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          )}

          {selectedCode && (
            <div className="flex-1 flex flex-col p-4 gap-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveComment()}
                />
                <Button size="icon" onClick={handleSaveComment} disabled={!newComment.trim() || saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <ul className="space-y-2">
                  {selectedComments.map((c, i) => (
                    <li key={i} className="text-sm rounded-md bg-background p-2 border border-border">{c}</li>
                  ))}
                  {selectedComments.length === 0 && (
                    <li className="text-sm text-muted-foreground">No comments yet.</li>
                  )}
                </ul>
              </ScrollArea>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
