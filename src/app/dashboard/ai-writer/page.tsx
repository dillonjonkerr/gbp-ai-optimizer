'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/v0-dashboard/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sparkles,
  FileText,
  MessageSquare,
  Briefcase,
  HelpCircle,
  Copy,
  RefreshCw,
  Check,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const suggestedKeywords = [
  'emergency plumber',
  '24/7 service',
  'licensed plumber',
  'same-day service',
  'affordable plumbing',
  'drain cleaning',
  'water heater repair',
]

const postTones = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'informative', label: 'Informative' },
]

const postTypes = [
  { value: 'update', label: 'Business Update' },
  { value: 'offer', label: 'Special Offer' },
  { value: 'event', label: 'Event' },
  { value: 'product', label: 'Product/Service' },
]

export default function AIWriterPage() {
  const [activeTab, setActiveTab] = useState('posts')
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(['emergency plumber', '24/7 service'])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [copied, setCopied] = useState(false)

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]
    )
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent(
        activeTab === 'posts'
          ? "Need a reliable plumber fast? Our team of licensed professionals is available 24/7 for all your emergency plumbing needs!\n\nFrom drain cleaning to water heater repair, we've got you covered with same-day service and affordable rates.\n\nCall us now or book online - we're here when you need us most!"
          : activeTab === 'description'
          ? "Trusted plumbing experts serving the greater Los Angeles area for over 15 years. Our licensed, insured team specializes in emergency plumber services, water heater repair, drain cleaning, and complete plumbing solutions.\n\nAvailable 24/7 with same-day service and upfront pricing. No job too big or small - from simple repairs to full renovations.\n\nCall now for a free estimate!"
          : activeTab === 'services'
          ? "Emergency Plumbing - Available 24/7 for urgent repairs\nDrain Cleaning - Professional drain clearing and maintenance\nWater Heater Repair - Tank and tankless water heater services\nPipe Repair - Leak detection and pipe replacement\nSewer Line Services - Camera inspection and repair\nGas Line Services - Licensed gas plumber on staff"
          : "Q: Do you offer emergency plumbing services?\nA: Yes! We're available 24/7 for all plumbing emergencies. Call us anytime and we'll dispatch a licensed plumber to your location.\n\nQ: What areas do you serve?\nA: We proudly serve the greater Los Angeles area including...\n\nQ: Do you provide free estimates?\nA: Absolutely! We offer free estimates for all plumbing projects."
      )
      setIsGenerating(false)
    }, 2000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerate = () => {
    setGeneratedContent('')
    handleGenerate()
  }

  return (
    <>
      <DashboardHeader
        title="AI Writer"
        description="Generate optimized content for your Google Business Profile"
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted grid w-full grid-cols-4">
              <TabsTrigger value="posts" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Posts</span>
              </TabsTrigger>
              <TabsTrigger value="description" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Description</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Services</span>
              </TabsTrigger>
              <TabsTrigger value="qa" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Q&A</span>
              </TabsTrigger>
            </TabsList>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Input Panel */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {activeTab === 'posts' && 'Generate Google Post'}
                    {activeTab === 'description' && 'Generate Business Description'}
                    {activeTab === 'services' && 'Generate Services List'}
                    {activeTab === 'qa' && 'Generate Q&A'}
                  </CardTitle>
                  <CardDescription>
                    Select keywords and options to generate optimized content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Keywords */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                      Include Keywords
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {suggestedKeywords.map((keyword) => (
                        <Badge
                          key={keyword}
                          variant={selectedKeywords.includes(keyword) ? 'default' : 'outline'}
                          className={cn(
                            'cursor-pointer transition-colors',
                            selectedKeywords.includes(keyword)
                              ? 'bg-primary hover:bg-primary/90'
                              : 'hover:bg-muted'
                          )}
                          onClick={() => toggleKeyword(keyword)}
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Post-specific options */}
                  {activeTab === 'posts' && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Post Type</label>
                        <Select defaultValue="update">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {postTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Tone</label>
                        <Select defaultValue="professional">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {postTones.map((tone) => (
                              <SelectItem key={tone.value} value={tone.value}>
                                {tone.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Additional context */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Additional Context (optional)
                    </label>
                    <Textarea
                      placeholder="Add any specific details you want to include..."
                      className="min-h-24 resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || selectedKeywords.length === 0}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Output Panel */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Generated Content</CardTitle>
                    {generatedContent && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleRegenerate}>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Regenerate
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="flex h-64 items-center justify-center">
                      <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                        <p className="text-sm text-muted-foreground">AI is writing your content...</p>
                      </div>
                    </div>
                  ) : generatedContent ? (
                    <div className="space-y-4">
                      <div className="rounded-lg border border-border bg-muted/30 p-4">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">
                          {generatedContent}
                        </pre>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="h-3 w-3" />
                        <span>Keywords used: {selectedKeywords.join(', ')}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
                      <div className="text-center space-y-2">
                        <Sparkles className="h-8 w-8 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          Select keywords and click generate
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </div>
      </main>
    </>
  )
}
