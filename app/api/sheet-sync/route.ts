import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";

function settings() {
  const values = env as unknown as Record<string, string | undefined>;
  return { url: values.GOOGLE_SHEETS_WEB_APP_URL || process.env.GOOGLE_SHEETS_WEB_APP_URL, token: values.GOOGLE_SHEETS_SYNC_TOKEN || process.env.GOOGLE_SHEETS_SYNC_TOKEN };
}

function authorized(request: Request) {
  return Boolean(request.headers.get("oai-authenticated-user-id")) || process.env.NODE_ENV === "development";
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  const { url, token } = settings();
  if (!url || !token) return NextResponse.json({ error: "Google Sheets connection is not configured." }, { status: 503 });
  const response = await fetch(`${url}?token=${encodeURIComponent(token)}`, { redirect: "follow" });
  return NextResponse.json(await response.json(), { status: response.ok ? 200 : 502 });
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  const { url, token } = settings();
  if (!url || !token) return NextResponse.json({ error: "Google Sheets connection is not configured." }, { status: 503 });
  const body = await request.json() as Record<string, unknown>;
  const response = await fetch(url, { method: "POST", headers: { "content-type": "text/plain;charset=utf-8" }, body: JSON.stringify({ ...body, token }), redirect: "follow" });
  return NextResponse.json(await response.json(), { status: response.ok ? 200 : 502 });
}

