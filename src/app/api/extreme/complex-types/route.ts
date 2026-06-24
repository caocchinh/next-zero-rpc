import { createApiError, createApiSuccess } from "@/lib/next-zero-rpc/responses";
import { NextRequest } from "next/server";

// We create insanely complicated types to test TypeScript's limits
type DiscriminatedUnion =
  | { type: "success"; payload: { id: string; metrics: Record<string, number[]> } }
  | { type: "failure"; reason: string; code: number };

type RecursiveTree<T> = {
  value: T;
  children?: RecursiveTree<T>[];
};

type IntersectionTest = { base: string } & ({ variantA: number } | { variantB: boolean });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.triggerError) {
      return createApiError("system:internal-server-error", 500);
    }

    const unionData: DiscriminatedUnion = {
      type: "success",
      payload: { id: "idx-999", metrics: { cpu: [10, 20, 30], mem: [50, 60] } },
    };

    const tree: RecursiveTree<DiscriminatedUnion> = {
      value: unionData,
      children: [
        {
          value: { type: "failure", reason: "timeout", code: 408 },
          children: [],
        },
      ],
    };

    const intersection: IntersectionTest = {
      base: "test",
      variantB: true,
    };

    const payload = {
      union: unionData,
      tree,
      intersection,
      matrixStringTuple: ["a", "b", "c"] as const,
      nullableField: null,
      optionalField: undefined as string | undefined,
      bigIntSimulate: "9007199254740991",
    };

    return createApiSuccess(payload);
  } catch {
    return createApiError("validation:invalid-payload", 400);
  }
}
