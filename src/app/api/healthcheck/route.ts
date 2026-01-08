import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
    try {
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Playwright automation failed", error);
        return NextResponse.json({ error: "Automation failed" }, { status: 500 });
    } finally {
    }
}
