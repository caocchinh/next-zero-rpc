import { createApiSuccess } from "@/lib/next-zero-rpc/responses";

export async function GET() {
  return createApiSuccess({
    activeUsers: [
      { id: "active-1", name: "Alice", role: "admin" },
      { id: "active-2", name: "Bob", role: "member" },
    ],
    count: 2,
  });
}
