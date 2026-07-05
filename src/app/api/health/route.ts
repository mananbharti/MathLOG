import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "math-os",
    storage: process.env.NEXT_PUBLIC_SUPABASE_URL ? "supabase-configured" : "local-first",
    timestamp: new Date().toISOString()
  });
}
