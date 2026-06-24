import { createApiError, createApiSuccess } from "@/lib/next-zero-rpc/responses";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ userId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { userId } = await params;

  if (userId === "not-found") {
    return createApiError("system:database-error", 404, {
      userId: ["User not found in the database"],
    });
  }

  return createApiSuccess({
    id: userId,
    name: "John Doe",
    role: "student",
  });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { userId } = await params;

  try {
    const body = await req.json();

    if (!body.name) {
      return createApiError("validation:missing-required-fields", 400);
    }

    return createApiSuccess({
      id: userId,
      name: body.name,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return createApiError("validation:invalid-payload", 400);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { userId } = await params;

  if (userId === "admin") {
    return createApiError("auth:forbidden", 403, {
      userId: ["Cannot delete admin user"],
    });
  }

  // Returning 204 No Content
  return createApiSuccess(undefined, 204);
}
