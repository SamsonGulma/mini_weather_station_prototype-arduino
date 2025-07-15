"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Zap, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WeatherAnalysis } from "@/hooks/use-weather-analysis"

interface PatternsAnalysisProps {
  analysis: WeatherAnalysis
}

export function PatternsAnalysis({ analysis }: PatternsAnalysisProps) {
  const getPatternColor = (pattern: string) => {
    switch (pattern) {
      case "consistent":
        return "text-green-700 bg-green-100"
      case "variable":
        return "text-red-700 bg-red-100"
      case "cyclic":
        return "text-blue-700 bg-blue-100"
      default:
        return "text-gray-700 bg-gray-100"
    }
  }

  const getVarianceLevel = (variance: number) => {
    if (variance < 5) return { level: "Low", color: "text-green-700 bg-green-100" }
    if (variance < 15) return { level: "Moderate", color: "text-yellow-700 bg-yellow-100" }
    return { level: "High", color: "text-red-700 bg-red-100" }
  }

  const varianceInfo = getVarianceLevel(analysis.patterns.humidity_variance)

  return (
    <Card className="border-0 backdrop-blur-xl bg-white/60 shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">Pattern Analysis</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Environmental behavior insights</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Temperature Range */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <h4 className="font-semibold text-gray-700 text-sm">Temperature Range</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Peak</span>
                <span className="font-semibold text-red-600">{analysis.patterns.daily_peak_temp.toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Low</span>
                <span className="font-semibold text-blue-600">{analysis.patterns.daily_low_temp.toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Variation</span>
                <span className="font-semibold text-gray-700">
                  {(analysis.patterns.daily_peak_temp - analysis.patterns.daily_low_temp).toFixed(1)}°C
                </span>
              </div>
            </div>
          </div>

          {/* Humidity Variance */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <h4 className="font-semibold text-gray-700 text-sm">Humidity Stability</h4>
            </div>
            <div className="space-y-2">
              <Badge className={cn("text-xs", varianceInfo.color)}>{varianceInfo.level} Variance</Badge>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Stability</span>
                  <span>{(100 - Math.min(100, analysis.patterns.humidity_variance * 2)).toFixed(0)}%</span>
                </div>
                <Progress value={100 - Math.min(100, analysis.patterns.humidity_variance * 2)} className="h-2" />
              </div>
            </div>
          </div>

          {/* Light Pattern */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-yellow-500" />
              <h4 className="font-semibold text-gray-700 text-sm">Light Behavior</h4>
            </div>
            <div className="space-y-2">
              <Badge className={cn("text-xs", getPatternColor(analysis.patterns.light_pattern))}>
                {analysis.patterns.light_pattern}
              </Badge>
              <div className="text-xs text-gray-500">
                {analysis.patterns.light_pattern === "consistent" && "Stable lighting conditions"}
                {analysis.patterns.light_pattern === "variable" && "Fluctuating light levels"}
                {analysis.patterns.light_pattern === "cyclic" && "Regular light patterns"}
              </div>
            </div>
          </div>

          {/* Overall Health */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <h4 className="font-semibold text-gray-700 text-sm">Environment Health</h4>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">{analysis.conditions.comfort_index}/100</div>
              <Badge
                className={cn(
                  "text-xs",
                  analysis.conditions.overall === "excellent"
                    ? "text-green-700 bg-green-100"
                    : analysis.conditions.overall === "good"
                      ? "text-blue-700 bg-blue-100"
                      : analysis.conditions.overall === "fair"
                        ? "text-yellow-700 bg-yellow-100"
                        : "text-red-700 bg-red-100",
                )}
              >
                {analysis.conditions.overall}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
