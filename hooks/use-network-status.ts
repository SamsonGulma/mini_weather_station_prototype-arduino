"use client"

import { useState, useEffect } from "react"

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("/api/data", {
          method: "HEAD",
          cache: "no-cache",
        })
        const online = response.ok
        setIsOnline(online)
        if (online) {
          setLastUpdated(new Date())
        }
      } catch {
        setIsOnline(false)
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 5000)

    return () => clearInterval(interval)
  }, [])

  return { isOnline, lastUpdated }
}
