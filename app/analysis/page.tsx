"use client"

import { useState, useEffect } from "react"
import { ConditionCards } from "@/components/condition-cards"
import { InsightsPanel } from "@/components/insights-panel"
import { PatternsAnalysis } from "@/components/patterns-analysis"
import { useWeatherAnalysis, type WeatherReading } from "@/hooks/use-weather-analysis"
import { useToast } from "@/hooks/use-toast"
import { RefreshCw, Brain, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AnalysisPage() {
  const [data, setData] = useState<WeatherReading[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const { toast } = useToast()

  const analysis = useWeatherAnalysis(data)

  useEffect(() => {
    fetchAnalysisData()
  }, [])

  const fetchAnalysisData = async () => {
    try {
      setIsLoading(true)
      // Fetch recent data for analysis (last 2 hours)
      const response = await fetch("/api/analysis-data")
      if (!response.ok) throw new Error("Failed to fetch analysis data")

      const analysisData = await response.json()
      setData(analysisData)
      setLastRefresh(new Date())
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch analysis data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white/60 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Analyzing Data</h2>
          <p className="text-gray-600">Processing environmental patterns and insights...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white/60 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No Data Available</h2>
          <p className="text-gray-600 mb-6">Insufficient data for analysis. Start collecting data to see insights.</p>
          <Button onClick={fetchAnalysisData} className="bg-gradient-to-r from-blue-500 to-purple-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-3 bg-white/60 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-lg border border-white/20 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-700">AI Analysis</span>
        </div>

        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-4">
          Weather Intelligence
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
          Advanced analytics and insights from your environmental data with AI-powered recommendations
        </p>

        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={fetchAnalysisData}
            variant="outline"
            size="sm"
            className="bg-white/50 backdrop-blur-sm border-white/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Analysis
          </Button>
          {lastRefresh && (
            <span className="text-sm text-gray-500">Last updated: {lastRefresh.toLocaleTimeString()}</span>
          )}
        </div>
      </div>

      <ConditionCards analysis={analysis} />
      <InsightsPanel analysis={analysis} />
      <PatternsAnalysis analysis={analysis} />
    </div>
  )
}
