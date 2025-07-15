"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Thermometer, Droplets, Sun, TrendingUp, TrendingDown, Minus, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WeatherAnalysis } from "@/hooks/use-weather-analysis"

interface ConditionCardsProps {
  analysis: WeatherAnalysis
}

export function ConditionCards({ analysis }: ConditionCardsProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising":
        return <TrendingUp className="h-4 w-4" />
      case "falling":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "rising":
        return "text-red-600 bg-red-50"
      case "falling":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getComfortColor = (comfort: string) => {
    switch (comfort) {
      case "comfortable":
        return "text-green-700 bg-green-100"
      case "cold":
      case "hot":
      case "dry":
      case "very_humid":
        return "text-red-700 bg-red-100"
      default:
        return "text-yellow-700 bg-yellow-100"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      {/* Temperature Card */}
      <Card className="border-0 backdrop-blur-xl bg-white/60 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
                <Thermometer className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-sm font-semibold text-gray-700">Temperature</CardTitle>
            </div>
            <Badge className={cn("text-xs", getTrendColor(analysis.temperature.trend))}>
              {getTrendIcon(analysis.temperature.trend)}
              <span className="ml-1 capitalize">{analysis.temperature.trend}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold text-gray-900">{analysis.temperature.current.toFixed(1)}°C</div>
          <Badge className={cn("text-xs", getComfortColor(analysis.temperature.comfort))}>
            {analysis.temperature.comfort}
          </Badge>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Range</span>
              <span>
                {analysis.temperature.min.toFixed(1)}° - {analysis.temperature.max.toFixed(1)}°
              </span>
            </div>
            <Progress value={(analysis.temperature.current / 40) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Humidity Card */}
      <Card className="border-0 backdrop-blur-xl bg-white/60 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Droplets className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-sm font-semibold text-gray-700">Humidity</CardTitle>
            </div>
            <Badge className={cn("text-xs", getTrendColor(analysis.humidity.trend))}>
              {getTrendIcon(analysis.humidity.trend)}
              <span className="ml-1 capitalize">{analysis.humidity.trend}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold text-gray-900">{analysis.humidity.current.toFixed(1)}%</div>
          <Badge className={cn("text-xs", getComfortColor(analysis.humidity.comfort))}>
            {analysis.humidity.comfort}
          </Badge>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Range</span>
              <span>
                {analysis.humidity.min.toFixed(1)}% - {analysis.humidity.max.toFixed(1)}%
              </span>
            </div>
            <Progress value={analysis.humidity.current} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Light Card */}
      <Card className="border-0 backdrop-blur-xl bg-white/60 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl">
                <Sun className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-sm font-semibold text-gray-700">Light Level</CardTitle>
            </div>
            <Badge className={cn("text-xs", getTrendColor(analysis.light.trend))}>
              {getTrendIcon(analysis.light.trend)}
              <span className="ml-1 capitalize">{analysis.light.trend}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold text-gray-900">{analysis.light.current}</div>
          <Badge className={cn("text-xs", getComfortColor(analysis.light.condition))}>{analysis.light.condition}</Badge>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Range</span>
              <span>
                {analysis.light.min} - {analysis.light.max}
              </span>
            </div>
            <Progress value={(analysis.light.current / 1000) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Comfort Index Card */}
      <Card className="border-0 backdrop-blur-xl bg-white/60 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-sm font-semibold text-gray-700">Comfort Index</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
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
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Score</span>
              <span>{analysis.conditions.comfort_index}%</span>
            </div>
            <Progress value={analysis.conditions.comfort_index} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
