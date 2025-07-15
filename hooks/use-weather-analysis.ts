"use client"

import { useMemo } from "react"

export interface WeatherReading {
  time: string
  temp: number
  hum: number
  light: number
  timestamp: Date
}

export interface WeatherAnalysis {
  temperature: {
    current: number
    min: number
    max: number
    avg: number
    trend: "rising" | "falling" | "stable"
    comfort: "cold" | "cool" | "comfortable" | "warm" | "hot"
    changeRate: number
  }
  humidity: {
    current: number
    min: number
    max: number
    avg: number
    trend: "rising" | "falling" | "stable"
    comfort: "dry" | "comfortable" | "humid" | "very_humid"
    changeRate: number
  }
  light: {
    current: number
    min: number
    max: number
    avg: number
    trend: "rising" | "falling" | "stable"
    condition: "dark" | "dim" | "moderate" | "bright" | "very_bright"
    changeRate: number
  }
  conditions: {
    overall: "excellent" | "good" | "fair" | "poor"
    comfort_index: number
    recommendations: string[]
    alerts: Array<{ type: "warning" | "info" | "success"; message: string }>
  }
  patterns: {
    daily_peak_temp: number
    daily_low_temp: number
    humidity_variance: number
    light_pattern: "consistent" | "variable" | "cyclic"
  }
}

export function useWeatherAnalysis(data: WeatherReading[]): WeatherAnalysis {
  return useMemo(() => {
    if (data.length === 0) {
      return {
        temperature: {
          current: 0,
          min: 0,
          max: 0,
          avg: 0,
          trend: "stable",
          comfort: "comfortable",
          changeRate: 0,
        },
        humidity: {
          current: 0,
          min: 0,
          max: 0,
          avg: 0,
          trend: "stable",
          comfort: "comfortable",
          changeRate: 0,
        },
        light: {
          current: 0,
          min: 0,
          max: 0,
          avg: 0,
          trend: "stable",
          condition: "moderate",
          changeRate: 0,
        },
        conditions: {
          overall: "good",
          comfort_index: 75,
          recommendations: [],
          alerts: [],
        },
        patterns: {
          daily_peak_temp: 0,
          daily_low_temp: 0,
          humidity_variance: 0,
          light_pattern: "consistent",
        },
      }
    }

    const temps = data.map((d) => d.temp)
    const hums = data.map((d) => d.hum)
    const lights = data.map((d) => d.light)

    // Temperature analysis
    const tempCurrent = temps[temps.length - 1]
    const tempMin = Math.min(...temps)
    const tempMax = Math.max(...temps)
    const tempAvg = temps.reduce((a, b) => a + b, 0) / temps.length

    const tempTrend = getTrend(temps.slice(-10))
    const tempComfort = getTemperatureComfort(tempCurrent)
    const tempChangeRate = temps.length > 1 ? tempCurrent - temps[temps.length - 2] : 0

    // Humidity analysis
    const humCurrent = hums[hums.length - 1]
    const humMin = Math.min(...hums)
    const humMax = Math.max(...hums)
    const humAvg = hums.reduce((a, b) => a + b, 0) / hums.length

    const humTrend = getTrend(hums.slice(-10))
    const humComfort = getHumidityComfort(humCurrent)
    const humChangeRate = hums.length > 1 ? humCurrent - hums[hums.length - 2] : 0

    // Light analysis
    const lightCurrent = lights[lights.length - 1]
    const lightMin = Math.min(...lights)
    const lightMax = Math.max(...lights)
    const lightAvg = lights.reduce((a, b) => a + b, 0) / lights.length

    const lightTrend = getTrend(lights.slice(-10))
    const lightCondition = getLightCondition(lightCurrent)
    const lightChangeRate = lights.length > 1 ? lightCurrent - lights[lights.length - 2] : 0

    // Overall conditions
    const comfortIndex = calculateComfortIndex(tempCurrent, humCurrent)
    const overall = getOverallCondition(comfortIndex)
    const recommendations = getRecommendations(tempCurrent, humCurrent, lightCurrent)
    const alerts = getAlerts(tempCurrent, humCurrent, lightCurrent, tempTrend, humTrend)

    // Patterns
    const humidityVariance = Math.sqrt(hums.reduce((acc, val) => acc + Math.pow(val - humAvg, 2), 0) / hums.length)
    const lightPattern = getLightPattern(lights)

    return {
      temperature: {
        current: tempCurrent,
        min: tempMin,
        max: tempMax,
        avg: tempAvg,
        trend: tempTrend,
        comfort: tempComfort,
        changeRate: tempChangeRate,
      },
      humidity: {
        current: humCurrent,
        min: humMin,
        max: humMax,
        avg: humAvg,
        trend: humTrend,
        comfort: humComfort,
        changeRate: humChangeRate,
      },
      light: {
        current: lightCurrent,
        min: lightMin,
        max: lightMax,
        avg: lightAvg,
        trend: lightTrend,
        condition: lightCondition,
        changeRate: lightChangeRate,
      },
      conditions: {
        overall,
        comfort_index: comfortIndex,
        recommendations,
        alerts,
      },
      patterns: {
        daily_peak_temp: tempMax,
        daily_low_temp: tempMin,
        humidity_variance: humidityVariance,
        light_pattern: lightPattern,
      },
    }
  }, [data])
}

function getTrend(values: number[]): "rising" | "falling" | "stable" {
  if (values.length < 3) return "stable"

  const recent = values.slice(-3)
  const slope = (recent[2] - recent[0]) / 2

  if (Math.abs(slope) < 0.5) return "stable"
  return slope > 0 ? "rising" : "falling"
}

function getTemperatureComfort(temp: number): "cold" | "cool" | "comfortable" | "warm" | "hot" {
  if (temp < 16) return "cold"
  if (temp < 20) return "cool"
  if (temp < 26) return "comfortable"
  if (temp < 30) return "warm"
  return "hot"
}

function getHumidityComfort(hum: number): "dry" | "comfortable" | "humid" | "very_humid" {
  if (hum < 30) return "dry"
  if (hum < 60) return "comfortable"
  if (hum < 80) return "humid"
  return "very_humid"
}

function getLightCondition(light: number): "dark" | "dim" | "moderate" | "bright" | "very_bright" {
  if (light < 100) return "dark"
  if (light < 300) return "dim"
  if (light < 600) return "moderate"
  if (light < 800) return "bright"
  return "very_bright"
}

function calculateComfortIndex(temp: number, hum: number): number {
  // Simplified comfort index calculation
  let score = 100

  // Temperature scoring
  if (temp < 18 || temp > 28) score -= 20
  else if (temp < 20 || temp > 26) score -= 10

  // Humidity scoring
  if (hum < 30 || hum > 70) score -= 15
  else if (hum < 40 || hum > 60) score -= 5

  return Math.max(0, Math.min(100, score))
}

function getOverallCondition(comfortIndex: number): "excellent" | "good" | "fair" | "poor" {
  if (comfortIndex >= 85) return "excellent"
  if (comfortIndex >= 70) return "good"
  if (comfortIndex >= 50) return "fair"
  return "poor"
}

function getRecommendations(temp: number, hum: number, light: number): string[] {
  const recommendations: string[] = []

  if (temp > 28) {
    recommendations.push("Consider cooling the environment or improving ventilation")
  } else if (temp < 18) {
    recommendations.push("Consider heating the environment for better comfort")
  }

  if (hum > 70) {
    recommendations.push("High humidity detected - consider using a dehumidifier")
  } else if (hum < 30) {
    recommendations.push("Low humidity detected - consider using a humidifier")
  }

  if (light < 200) {
    recommendations.push("Low light levels - consider improving lighting for better visibility")
  }

  if (recommendations.length === 0) {
    recommendations.push("Environmental conditions are optimal")
  }

  return recommendations
}

function getAlerts(
  temp: number,
  hum: number,
  light: number,
  tempTrend: string,
  humTrend: string,
): Array<{ type: "warning" | "info" | "success"; message: string }> {
  const alerts: Array<{ type: "warning" | "info" | "success"; message: string }> = []

  if (temp > 32) {
    alerts.push({ type: "warning", message: "High temperature alert - take cooling measures" })
  } else if (temp < 10) {
    alerts.push({ type: "warning", message: "Low temperature alert - heating recommended" })
  }

  if (hum > 85) {
    alerts.push({ type: "warning", message: "Very high humidity - risk of condensation" })
  } else if (hum < 20) {
    alerts.push({ type: "warning", message: "Very low humidity - may cause discomfort" })
  }

  if (tempTrend === "rising" && temp > 26) {
    alerts.push({ type: "info", message: "Temperature is rising - monitor for overheating" })
  }

  if (humTrend === "rising" && hum > 65) {
    alerts.push({ type: "info", message: "Humidity is increasing - watch for condensation" })
  }

  if (alerts.length === 0) {
    alerts.push({ type: "success", message: "All environmental parameters are within normal ranges" })
  }

  return alerts
}

function getLightPattern(lights: number[]): "consistent" | "variable" | "cyclic" {
  if (lights.length < 10) return "consistent"

  const variance = Math.sqrt(
    lights.reduce((acc, val, _, arr) => {
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length
      return acc + Math.pow(val - mean, 2)
    }, 0) / lights.length,
  )

  const mean = lights.reduce((a, b) => a + b, 0) / lights.length

  if (variance / mean < 0.2) return "consistent"
  if (variance / mean > 0.5) return "variable"
  return "cyclic"
}
