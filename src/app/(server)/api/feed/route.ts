import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get("url");

  if (!urlParam) {
    return NextResponse.json({
      success: false,
      error: "Missing url parameter",
    });
  }

  try {
    const res = await fetch(urlParam);

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch feed",
      });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.log("Error fetching feeds:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch" });
  }
}
