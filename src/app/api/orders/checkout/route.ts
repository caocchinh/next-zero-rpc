import { createApiError, createApiSuccess } from "@/lib/next-zero-rpc/responses";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.ticketId || !body.quantity) {
      return createApiError("validation:missing-required-fields", 400);
    }

    if (body.quantity > 5) {
      return createApiError("validation:invalid-payload", 400, {
        quantity: ["You can only buy up to 5 tickets at once."],
      });
    }

    if (body.ticketId === "sold-out") {
      return createApiError("validation:invalid-payload", 409);
    }

    return createApiSuccess(
      {
        orderId: `ord_${Math.random().toString(36).substring(7)}`,
        status: "success",
        totalAmount: body.quantity * 100000,
      },
      201,
    );
  } catch {
    return createApiError("validation:invalid-payload", 400);
  }
}
