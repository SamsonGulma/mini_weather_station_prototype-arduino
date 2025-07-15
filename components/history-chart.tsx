"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface HistoryReading {
  time: string
  temp: number
  hum: number
  light: number
}

interface HistoryChartProps {
  data: HistoryReading[]
  isLoading: boolean
}

export function HistoryChart({ data, isLoading }: HistoryChartProps) {
  // Sample data for better visualization (take every 10th point if data is large)
  const chartData = data.length > 100 ? data.filter((_, index) => index % Math.ceil(data.length / 100) === 0) : data

  const processedData = chartData.map((reading) => ({
    time: reading.time,
    temp: reading.temp,
    hum: reading.hum,
    light: reading.light / 10, // Scale down for better visualization
  }))

  if (isLoading) {
    return (
      <Card className="border-0 backdrop-blur-xl bg-white/60 shadow-2xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Historical Trends</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Long-term data analysis and patterns</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-200 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 backdrop-blur-xl bg-white/60 shadow-2xl">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Historical Trends</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Long-term data analysis and patterns</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-500">No data to display</div>
        ) : (
          <div className="h-80 bg-gradient-to-br from-gray-50/50 to-white/50 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(label) => `Time: ${label}`}
                  formatter={(value: number, name: string) => [
                    name === "light" ? (value * 10).toFixed(0) : value.toFixed(1),
                    name === "temp" ? "Temperature (°C)" : name === "hum" ? "Humidity (%)" : "Light",
                  ]}
                />
                <Legend />
                <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} dot={false} name="Temperature" />
                <Line type="monotone" dataKey="hum" stroke="#3b82f6" strokeWidth={2} dot={false} name="Humidity" />
                <Line type="monotone" dataKey="light" stroke="#eab308" strokeWidth={2} dot={false} name="Light (÷10)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
