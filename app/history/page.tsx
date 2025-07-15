"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Filter, RotateCcw } from "lucide-react"
import { HistoryTable } from "@/components/history-table"
import { HistoryChart } from "@/components/history-chart"
import { useToast } from "@/hooks/use-toast"

interface HistoryReading {
  time: string
  temp: number
  hum: number
  light: number
}

export default function HistoryPage() {
  const [data, setData] = useState<HistoryReading[]>([])
  const [filteredData, setFilteredData] = useState<HistoryReading[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/history")
      if (!response.ok) throw new Error("Failed to fetch history")

      const historyData = await response.json()
      setData(historyData)
      setFilteredData(historyData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch history data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilter = () => {
    if (!startTime && !endTime) {
      setFilteredData(data)
      return
    }

    const filtered = data.filter((reading) => {
      const readingTime = reading.time
      if (startTime && readingTime < startTime) return false
      if (endTime && readingTime > endTime) return false
      return true
    })

    setFilteredData(filtered)
    toast({
      title: "Filter Applied",
      description: `Showing ${filtered.length} records`,
    })
  }

  const resetFilter = () => {
    setStartTime("")
    setEndTime("")
    setFilteredData(data)
  }

  const exportCSV = async () => {
    try {
      const response = await fetch("/api/export")
      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `weather-data-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Export Successful",
        description: "CSV file has been downloaded",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export data",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data History</h1>
        <p className="text-gray-600">View and analyze historical weather data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="start-time">Start Time</Label>
              <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="end-time">End Time</Label>
              <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button onClick={applyFilter} className="flex-1">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button onClick={resetFilter} variant="outline">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={exportCSV} variant="secondary" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <HistoryChart data={filteredData} isLoading={isLoading} />

      <HistoryTable data={filteredData} isLoading={isLoading} />
    </div>
  )
}
