"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb, AlertTriangle, Info, CheckCircle, Target, Activity } from "lucide-react"
import type { WeatherAnalysis } from "@/hooks/use-weather-analysis"

interface InsightsPanelProps {
  analysis: WeatherAnalysis
}

export function InsightsPanel({ analysis }: InsightsPanelProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "warning":
        return "destructive"
      case "success":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Recommendations */}
      <Card className="border-0 backdrop-blur-xl bg-white/60 shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">Smart Recommendations</CardTitle>
              <p className="text-sm text-gray-500 mt-1">AI-powered insights for optimal conditions</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysis.conditions.recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50"
            >
              <div className="p-1 bg-emerald-500 rounded-full mt-0.5">
                <Target className="h-3 w-3 text-white" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{recommendation}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Alerts & Status */}
      <Card className="border-0 backdrop-blur-xl bg-white/60 shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">System Alerts</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Real-time monitoring notifications</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis.conditions.alerts.map((alert, index) => (
            <Alert key={index} variant={getAlertVariant(alert.type)} className="border-0 shadow-sm">
              <div className="flex items-center space-x-2">
                {getAlertIcon(alert.type)}
                <AlertDescription className="text-sm">{alert.message}</AlertDescription>
              </div>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
