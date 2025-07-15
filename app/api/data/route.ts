// /app/api/data/route.js   (or wherever your Next.js app’s API folder is)
import { NextResponse } from "next/server";

const FLASK_DATA_URL = "http://localhost:5000/data"; // change if needed

export async function GET() {
    try {
        // 1) Proxy the request to the Flask backend’s /data endpoint
        const flaskRes = await fetch(FLASK_DATA_URL, {
            // Note: since this is a server‐side fetch (Next.js), CORS isn’t an issue.
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            // You can add a timeout if you like, but Node‐fetch in Next.js doesn’t support it natively.
        });

        // 2) If Flask returns a non‐200 status, forward that status (or map it to 502)
        if (!flaskRes.ok) {
            return new NextResponse(
                JSON.stringify({ error: `Flask returned ${flaskRes.status}` }),
                { status: 502, headers: { "Content-Type": "application/json" } }
            );
        }

        // 3) Parse the JSON that Flask sent
        const data = await flaskRes.json();

        console.log(data);

        // 4) Return it directly to whoever called this Next.js API
        return NextResponse.json(data);
    } catch (err) {
        // 5) If fetch threw (Flask is down, network error, etc.), return a 502
        console.error("Error proxying to Flask /data:", err);
        return new NextResponse(
            JSON.stringify({ error: "Could not reach Flask backend" }),
            { status: 502, headers: { "Content-Type": "application/json" } }
        );
    }
}

export async function HEAD() {
    // Simply acknowledge that the endpoint exists
    return new NextResponse(null, { status: 200 });
}
