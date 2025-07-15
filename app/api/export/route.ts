// /app/api/export/route.ts

import { NextResponse } from "next/server";

const FLASK_HISTORY_URL = "http://localhost:5000/history"; // update if needed

export async function GET() {
    try {
        // 1. Fetch real data from Flask
        const flaskRes = await fetch(FLASK_HISTORY_URL);
        if (!flaskRes.ok) {
            return new NextResponse("Failed to fetch history data", {
                status: 502,
            });
        }

        const history = await flaskRes.json();

        // 2. Format headers and data rows
        const headers = ["Time", "Temperature (°C)", "Humidity (%)", "Light"];
        const rows = history.map((entry: any) => [
            entry.time,
            entry.temp.toFixed(1),
            entry.hum.toFixed(1),
            entry.light,
        ]);

        const csvContent = [headers, ...rows]
            .map((r) => r.join(","))
            .join("\n");

        // 3. Return CSV response
        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition":
                    'attachment; filename="weather-data.csv"',
            },
        });
    } catch (err) {
        console.error("Error generating CSV:", err);
        return new NextResponse("Error generating CSV", { status: 500 });
    }
}
