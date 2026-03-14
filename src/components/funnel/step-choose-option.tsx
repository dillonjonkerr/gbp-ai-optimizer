'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Zap, FileText, CheckCircle, ArrowRight, Crown } from 'lucide-react'

interface StepChooseOptionProps {
  onSelectDIY: () => void
  onSelectAI: () => void
}

export function StepChooseOption({ onSelectDIY, onSelectAI }: StepChooseOptionProps) {
  const diyFeatures = [
    'Professional audit report (PDF)',
    'Step-by-step improvement guide',
    'Painting keyword recommendations',
    'Local competitor analysis',
  ]

  const aiFeatures = [
    'AI-powered profile optimization',
    'Automated post scheduling',
    'Real-time keyword tracking',
    'Continuous competitor monitoring',
  ]

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col px-5 py-8 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-md space-y-6">
        {/* Header */}
        <div className="space-y-3 text-center animate-fade-in-up">
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Choose your path forward
          </h1>
          <p className="text-base font-semibold text-muted-foreground">
            Start capturing those missed painting leads today
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* DIY Option */}
          <Card className="border-2 border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg animate-fade-in-up opacity-0 animation-delay-100">
            <CardHeader className="pb-3 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted shrink-0 shadow-lg">
                  <FileText className="h-7 w-7 text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-xl font-black">DIY Fix Plan</CardTitle>
                  <CardDescription className="text-sm font-medium mt-1">
                    Download a professional audit with exact steps to improve your profile yourself.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-5 pt-0">
              <ul className="space-y-2">
                {diyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={onSelectDIY}
                variant="outline"
                className="w-full h-12 text-base font-bold border-2"
              >
                <Download className="mr-2 h-5 w-5" />
                Download My Fix Plan
              </Button>
            </CardContent>
          </Card>

          {/* AI Option */}
          <Card className="border-2 border-primary bg-card relative overflow-hidden shadow-xl shadow-primary/20 animate-fade-in-up opacity-0 animation-delay-200">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            <div className="absolute top-4 right-4">
              <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 shadow-lg shadow-primary/30">
                <Crown className="h-3.5 w-3.5 mr-1.5" />
                Best Value
              </Badge>
            </div>
            <CardHeader className="pb-3 p-5 relative">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary shrink-0 shadow-xl shadow-primary/30">
                  <Zap className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="min-w-0 flex-1 pr-20">
                  <CardTitle className="text-xl font-black">AI Optimization</CardTitle>
                  <CardDescription className="text-sm font-medium mt-1">
                    Connect your GBP and let AI handle improvements automatically.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-5 pt-0 relative">
              <ul className="space-y-2">
                {aiFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={onSelectAI}
                className="w-full h-12 text-base font-bold shadow-xl shadow-primary/30"
              >
                <Zap className="mr-2 h-5 w-5" />
                Connect My Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
