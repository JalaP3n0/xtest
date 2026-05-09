import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth) {
    return NextResponse.json({ message: "Missing authorization header" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const response = await fetch(`${BACKEND_URL}/users/upload-photo`, {
      method: "POST",
      headers: {
        Authorization: auth,
      },
      body: formData,
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Photo upload proxy failed", details: String(error) },
      { status: 500 }
    );
  }
}
