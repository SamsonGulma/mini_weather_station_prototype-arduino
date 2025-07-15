"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface WeatherReading {
    time: string;
    temp: number;
    hum: number;
    light: number;
    timestamp: Date;
}

export function useWeatherData(interval = 1000, paused = false) {
    const [currentData, setCurrentData] = useState<WeatherReading | null>(null);
    const [historicalData, setHistoricalData] = useState<WeatherReading[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch("/api/data");
            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            const reading: WeatherReading = {
                ...data,
                timestamp: new Date(),
            };

            setCurrentData(reading);
            setHistoricalData((prev) => {
                const newData = [...prev, reading];
                // Keep only last 300 points (5 minutes at 1s intervals)
                return newData.slice(-300);
            });
            setError(null);
            setIsLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            if (!paused) {
                toast({
                    title: "Connection Error",
                    description: "Failed to fetch weather data",
                    variant: "destructive",
                });
            }
        }
    }, [toast, paused]);

    useEffect(() => {
        if (paused) return;

        fetchData();
        const intervalId = setInterval(fetchData, interval);

        return () => clearInterval(intervalId);
    }, [fetchData, interval, paused]);

    return {
        currentData,
        historicalData,
        isLoading,
        error,
        refetch: fetchData,
    };
}
