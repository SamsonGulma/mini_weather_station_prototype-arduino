"use client"

import { useState } from "react"
import { CurrentReadings } from "@/components/current-readings"
import { RealTimeChart } from "@/components/real-time-chart"
import { useWeatherData } from "@/hooks/use-weather-data"
import { AlertTriangle, Wifi } from "lucide-react"

export default function Dashboard() {
  const [interval, setInterval] = useState(1000)
  const [isPaused, setIsPaused] = useState(false)

  const { currentData, historicalData, isLoading, error } = useWeatherData(interval, isPaused)

  if (error && !currentData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white/60 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Connection Error</h2>
          <p className="text-gray-600 mb-2">Unable to fetch weather data</p>
          <p className="text-sm text-gray-500">Make sure the backend server is running</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-3 bg-white/60 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-lg border border-white/20 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Wifi className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-700">Live Dashboard</span>
        </div>

        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
          Weather Analytics
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Real-time monitoring of environmental conditions with advanced data visualization and insights
        </p>
      </div>

      <CurrentReadings data={currentData} isLoading={isLoading} />

      <RealTimeChart
        data={historicalData}
        isPaused={isPaused}
        onPauseToggle={() => setIsPaused(!isPaused)}
        interval={interval}
        onIntervalChange={setInterval}
      />

      {!currentData && !isLoading && (
        <div className="text-center py-16">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Wifi className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Waiting for data...</h3>
            <p className="text-gray-600">Ensure your weather station is connected and sending data</p>
          </div>
        </div>
      )}
    </div>
  )
}
