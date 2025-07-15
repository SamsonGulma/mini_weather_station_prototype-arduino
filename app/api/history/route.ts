import { NextResponse } from "next/server";

const FLASK_HISTORY_URL = "http://localhost:5000/history"; // Adjust if your Flask server runs elsewhere

export async function GET() {
    try {
        // 1) Forward the request to the Flask backend’s /history endpoint
        const flaskRes = await fetch(FLASK_HISTORY_URL, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        // 2) If Flask returned a non-2xx status, propagate an error
        if (!flaskRes.ok) {
            return new NextResponse(
                JSON.stringify({ error: `Flask returned ${flaskRes.status}` }),
                {
                    status: 502,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // 3) Parse the JSON array from Flask
        const data = await flaskRes.json();

        // 4) Return it directly
        return NextResponse.json(data);
    } catch (err) {
        // 5) On network or other errors, return a 502
        console.error("Error proxying to Flask /history:", err);
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
