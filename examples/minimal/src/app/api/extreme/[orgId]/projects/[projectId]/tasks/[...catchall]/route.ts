import { createApiSuccess } from "@/lib/next-zero-rpc/responses";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string; projectId: string; catchall: string[] }> },
) {
  const p = await params;

  const payload = {
    resolvedOrgId: p.orgId,
    resolvedProjectId: p.projectId,
    dynamicSegments: p.catchall,
    deeplyNestedMatrix: {
      layer1: {
        layer2: {
          layer3: [
            [
              { x: 1, y: 2 },
              { x: 3, y: 4 },
            ],
            [
              { x: 5, y: 6 },
              { x: 7, y: 8 },
            ],
          ] as const,
        },
      },
    },
  };

  return createApiSuccess(payload);
}
