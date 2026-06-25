import { createApiError, createApiSuccess } from "@/lib/next-zero-rpc/responses";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.email || !body.password) {
      return createApiError("validation:missing-required-fields", 400);
    }

    if (body.email !== "admin@vinschool.edu.vn" || body.password !== "password") {
      return createApiError("auth:unauthorized", 401);
    }

    return createApiSuccess({
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI...",
      user: { id: "123", email: body.email },
    });
  } catch {
    return createApiError("validation:invalid-payload", 400);
  }
}
