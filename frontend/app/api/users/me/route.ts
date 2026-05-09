import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth) {
    return NextResponse.json({ message: "Missing authorization header" }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: auth,
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Profile proxy failed", details: String(error) },
      { status: 500 }
    );
  }
}

