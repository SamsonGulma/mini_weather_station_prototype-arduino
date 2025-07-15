"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Pause, Settings, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WeatherReading } from "@/hooks/use-weather-data"

interface RealTimeChartProps {
  data: WeatherReading[]
  isPaused: boolean
  onPauseToggle: () => void
  interval: number
  onIntervalChange: (interval: number) => void
}

export function RealTimeChart({ data, isPaused, onPauseToggle, interval, onIntervalChange }: RealTimeChartProps) {
  const [visibleSeries, setVisibleSeries] = useState({
    temp: true,
    hum: true,
    light: true,
  })

  const chartData = data.map((reading) => ({
    time: reading.timestamp.toLocaleTimeString(),
    temp: reading.temp,
    hum: reading.hum,
    light: reading.light / 10, // Scale down light for better visualization
  }))

  const toggleSeries = (series: keyof typeof visibleSeries) => {
    setVisibleSeries((prev) => ({ ...prev, [series]: !prev[series] }))
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
          <p className="font-semibold text-gray-900 mb-2">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.name === "Light (÷10)" ? (entry.value * 10).toFixed(0) : entry.value.toFixed(1)}${
                entry.name === "Temperature" ? "°C" : entry.name === "Humidity" ? "%" : ""
              }`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="mb-8 border-0 backdrop-blur-xl bg-white/60 shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Real-Time Analytics</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Live sensor data visualization</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
              <Settings className="h-4 w-4 text-gray-500" />
              <Label htmlFor="interval" className="text-sm font-medium text-gray-700">
                Interval:
              </Label>
              <Input
                id="interval"
                type="number"
                min="500"
                max="10000"
                step="500"
                value={interval}
                onChange={(e) => onIntervalChange(Number(e.target.value))}
                className="w-20 h-8 text-sm border-0 bg-white/70 backdrop-blur-sm"
              />
              <span className="text-sm text-gray-500">ms</span>
            </div>

            <Button
              onClick={onPauseToggle}
              variant={isPaused ? "default" : "secondary"}
              size="sm"
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 font-semibold transition-all duration-200",
                isPaused
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-white/20",
              )}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? "Resume" : "Pause"}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          {[
            { key: "temp", label: "Temperature", color: "#ef4444", gradient: "from-red-500 to-orange-500" },
            { key: "hum", label: "Humidity", color: "#3b82f6", gradient: "from-blue-500 to-cyan-500" },
            { key: "light", label: "Light (÷10)", color: "#eab308", gradient: "from-yellow-500 to-amber-500" },
          ].map(({ key, label, color, gradient }) => (
            <div
              key={key}
              className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20"
            >
              <Checkbox
                id={key}
                checked={visibleSeries[key as keyof typeof visibleSeries]}
                onCheckedChange={() => toggleSeries(key as keyof typeof visibleSeries)}
                className="border-gray-300"
              />
              <Label htmlFor={key} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <div className={cn("w-3 h-3 rounded-full bg-gradient-to-r", gradient)} />
                {label}
              </Label>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="h-80 bg-gradient-to-br from-gray-50/50 to-white/50 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12, fill: "#64748b" }}
                interval="preserveStartEnd"
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={{ stroke: "#cbd5e1" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={{ stroke: "#cbd5e1" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
              {visibleSeries.temp && (
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={false}
                  name="Temperature"
                  strokeLinecap="round"
                />
              )}
              {visibleSeries.hum && (
                <Line
                  type="monotone"
                  dataKey="hum"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                  name="Humidity"
                  strokeLinecap="round"
                />
              )}
              {visibleSeries.light && (
                <Line
                  type="monotone"
                  dataKey="light"
                  stroke="#eab308"
                  strokeWidth={3}
                  dot={false}
                  name="Light (÷10)"
                  strokeLinecap="round"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
