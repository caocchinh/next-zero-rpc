import { NextResponse } from "next/server";
import { createApiSuccess } from "@/lib/next-zero-rpc/responses";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  switch (type) {
    case "null":
      return NextResponse.json(null);
    case "zero":
      return NextResponse.json(0);
    case "false":
      return NextResponse.json(false);
    case "empty-string":
      return NextResponse.json("");
    case "undefined":
      // Uses our newly fixed helper which returns `new NextResponse(null, { status: 204 })`
      return createApiSuccess(); 
    default:
      return NextResponse.json({ error: "unknown type" }, { status: 400 });
  }
}
