import { NextResponse } from "next/server";

const FLASK_HISTORY_URL = "http://localhost:5000/history"; // Adjust if your Flask server runs elsewhere

export async function GET() {
    try {
        // 1) Proxy the request to the Flask backend’s /history endpoint
        const flaskRes = await fetch(FLASK_HISTORY_URL, {
            method: "GET",
            headers: { Accept: "application/json" },
        });

        // 2) If Flask returns a non‐2xx status, forward an error
        if (!flaskRes.ok) {
            return new NextResponse(
                JSON.stringify({ error: `Flask returned ${flaskRes.status}` }),
                {
                    status: 502,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // 3) Parse the JSON array that Flask sent
        const data = await flaskRes.json();

        const enriched = data.map((entry) => {
            // Assuming `entry.time` is "HH:MM:SS", we rebuild a full Date object for 'timestamp'
            const [hh, mm, ss] = entry.time.split(":").map(Number);
            const now = new Date();
            now.setHours(hh, mm, ss, 0);
            return {
                ...entry,
                timestamp: now.toISOString(),
            };
        });

        // 5) Return the enriched array
        return NextResponse.json(enriched);
    } catch (err) {
        // 6) On network or other errors, return a 502
        console.error("Error proxying to Flask /history for analysis:", err);
        return new NextResponse(
            JSON.stringify({ error: "Could not reach Flask backend" }),
            {
                status: 502,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

export async function HEAD() {
    return new NextResponse(null, { status: 200 });
}
