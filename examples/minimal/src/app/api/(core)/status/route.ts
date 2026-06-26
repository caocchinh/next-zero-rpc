import { createApiSuccess } from "@/lib/next-zero-rpc/responses";

export async function GET() {
  return createApiSuccess({
    message: "This route is inside a route group (core)!",
    data: "system operational",
  });
}
