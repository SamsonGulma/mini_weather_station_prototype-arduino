"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Database } from "lucide-react"

interface HistoryReading {
  time: string
  temp: number
  hum: number
  light: number
}

interface HistoryTableProps {
  data: HistoryReading[]
  isLoading: boolean
}

export function HistoryTable({ data, isLoading }: HistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  if (isLoading) {
    return (
      <Card className="border-0 backdrop-blur-xl bg-white/60 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Historical Data</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Complete sensor readings archive</p>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
              <span className="text-sm font-semibold text-gray-700">{data.length} records</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 backdrop-blur-xl bg-white/60 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Historical Data</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Complete sensor readings archive</p>
            </div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
            <span className="text-sm font-semibold text-gray-700">{data.length} records</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 text-lg">No data available</div>
            <div className="text-sm text-gray-400 mt-2">Historical data will appear here once collected</div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-gray-50/50 to-white/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/20">
              <table className="w-full">
                <thead className="bg-white/50 backdrop-blur-sm">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                      Time
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                      Temperature (°C)
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                      Humidity (%)
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                      Light
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((reading, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/20 hover:bg-white/30 transition-colors duration-200"
                    >
                      <td className="py-4 px-6 font-mono text-sm text-gray-800">{reading.time}</td>
                      <td className="py-4 px-6 tabular-nums font-semibold text-gray-900">{reading.temp.toFixed(1)}</td>
                      <td className="py-4 px-6 tabular-nums font-semibold text-gray-900">{reading.hum.toFixed(1)}</td>
                      <td className="py-4 px-6 tabular-nums font-semibold text-gray-900">{reading.light}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
