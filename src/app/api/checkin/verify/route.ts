import { createApiError, createApiSuccess } from "@/lib/next-zero-rpc/responses";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.qrCode) {
      return createApiError("validation:missing-required-fields", 400);
    }

    if (body.qrCode === "already-used") {
      return createApiError("validation:invalid-payload", 409);
    }

    if (body.qrCode === "invalid") {
      return createApiError("auth:forbidden", 403);
    }

    return createApiSuccess({
      checkedIn: true,
      timestamp: new Date().toISOString(),
      student: {
        id: "stu_123",
        name: "Jane Doe",
      },
    });
  } catch {
    return createApiError("validation:invalid-payload", 400);
  }
}
