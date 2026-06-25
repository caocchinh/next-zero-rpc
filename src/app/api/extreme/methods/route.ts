import { createApiSuccess } from "@/lib/next-zero-rpc/responses";
import z from "zod";

export const schemaFactory = {
  GET: z.object({
    method: z.literal("GET"),
    data: z.array(z.number()),
  }),
  POST: z.object({
    method: z.literal("POST"),
    createdId: z.number(),
  }),
  PUT: z.object({
    method: z.literal("PUT"),
    updated: z.boolean(),
  }),
  DELETE: z.object({
    method: z.literal("DELETE"),
    deleted: z.boolean(),
  }),
  PATCH: z.object({
    method: z.literal("PATCH"),
    patchedFields: z.array(z.string()),
  }),
};

export async function GET() {
  const payload = { method: "GET" as const, data: [1, 2, 3] };
  return createApiSuccess(payload);
}

export async function POST() {
  const payload = { method: "POST" as const, createdId: 42 };

  return createApiSuccess(payload);
}

export async function PUT() {
  const payload = { method: "PUT" as const, updated: true };
  return createApiSuccess(payload);
}

export async function DELETE() {
  const payload = { method: "DELETE" as const, deleted: true };
  return createApiSuccess(payload);
}

export async function PATCH() {
  const payload = { method: "PATCH" as const, patchedFields: ["name"] };
  return createApiSuccess(payload);
}

export async function HEAD() {
  // HEAD typically doesn't return a body but we can see what typescript infers
  return new Response(null, { status: 200 });
}

export async function OPTIONS() {
  // OPTIONS might return some allow headers
  return new Response(null, {
    status: 204,
    headers: { Allow: "GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS" },
  });
}
