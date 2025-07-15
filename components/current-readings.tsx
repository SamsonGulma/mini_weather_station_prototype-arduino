"use client"

import { cn } from "@/lib/utils"

import { Thermometer, Droplets, Lightbulb, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { WeatherReading } from "@/hooks/use-weather-data"

interface CurrentReadingsProps {
  data: WeatherReading | null
  isLoading: boolean
}

export function CurrentReadings({ data, isLoading }: CurrentReadingsProps) {
  const readings = [
    {
      title: "Temperature",
      value: data?.temp ?? 0,
      unit: "°C",
      icon: Thermometer,
      gradient: "from-red-500 to-orange-500",
      bgGradient: "from-red-50 to-orange-50",
      shadowColor: "shadow-red-500/20",
      trend: data?.temp ? (data.temp > 25 ? "up" : "down") : null,
    },
    {
      title: "Humidity",
      value: data?.hum ?? 0,
      unit: "%",
      icon: Droplets,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      shadowColor: "shadow-blue-500/20",
      trend: data?.hum ? (data.hum > 60 ? "up" : "down") : null,
    },
    {
      title: "Light",
      value: data?.light ?? 0,
      unit: "",
      icon: Lightbulb,
      gradient: "from-yellow-500 to-amber-500",
      bgGradient: "from-yellow-50 to-amber-50",
      shadowColor: "shadow-yellow-500/20",
      trend: data?.light ? (data.light > 500 ? "up" : "down") : null,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {readings.map((reading) => {
        const Icon = reading.icon
        const TrendIcon = reading.trend === "up" ? TrendingUp : TrendingDown

        return (
          <Card
            key={reading.title}
            className={cn(
              "group relative overflow-hidden border-0 backdrop-blur-xl bg-white/60 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105",
              reading.shadowColor,
            )}
          >
            {/* Gradient background overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300",
                reading.bgGradient,
              )}
            />

            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={cn("p-3 rounded-2xl bg-gradient-to-br shadow-lg", reading.gradient)}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{reading.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {reading.title === "Light" ? "Sensor reading" : "Current level"}
                    </p>
                  </div>
                </div>

                {reading.trend && !isLoading && (
                  <div
                    className={cn(
                      "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
                      reading.trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700",
                    )}
                  >
                    <TrendIcon className="h-3 w-3" />
                    <span>{reading.trend === "up" ? "High" : "Normal"}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  </div>
                ) : (
                  <>
                    <div className="text-4xl font-bold text-gray-900 tabular-nums">
                      {reading.value.toFixed(1)}
                      <span className="text-2xl text-gray-500 ml-1">{reading.unit}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full bg-gradient-to-r transition-all duration-1000", reading.gradient)}
                          style={{
                            width: `${Math.min(100, (reading.value / (reading.title === "Temperature" ? 40 : reading.title === "Humidity" ? 100 : 1000)) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        {reading.title === "Temperature" ? "40°C" : reading.title === "Humidity" ? "100%" : "1000"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
