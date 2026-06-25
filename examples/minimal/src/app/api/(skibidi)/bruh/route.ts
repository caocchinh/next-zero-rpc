import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "This route is inside a route group (skibidi)!",
    data: "skibidi toilet",
  });
}
