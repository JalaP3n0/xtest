import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const limit = request.nextUrl.searchParams.get("limit") || "50";

  if (!auth) {
    return NextResponse.json({ message: "Missing authorization header" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/admin/alerts/no-shows?limit=${encodeURIComponent(limit)}`,
      {
        headers: { Authorization: auth },
        cache: "no-store",
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: "Proxy request failed", details: String(error) }, { status: 500 });
  }
}

