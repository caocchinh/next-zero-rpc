import { createApiSuccess } from "@/lib/next-zero-rpc/responses";

export async function GET() {
  // Simple health check route that just returns a system status
  return createApiSuccess({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}
