import { apiFetch } from "@/lib/next-zero-rpc/apiClient";
import { assertNever } from "@/lib/next-zero-rpc/responses";

export async function TypeInferenceDemo() {
  // 1. Basic Route: Hover over `err1.code` to see narrowed errors!
  const [res1, err1] = await apiFetch("/api/status", { method: "GET" });

  if (err1) {
    switch (err1.code) {
      case "system:unknown-error":
        console.error("A system error occurred:", err1.message);
        break;
      // You'll get a TypeScript error here if you forget to handle an error code
      // defined in your backend route!
      default:
        assertNever(err1.code);
    }
  } else {
    // res1 is strictly typed!
    console.log(res1.message);
  }

  // 2. Complex Types: Hover to see deep nested interfaces
  const [res2, err2] = await apiFetch("/api/extreme/complex-types", {
    method: "POST",
    body: JSON.stringify({ triggerError: false }),
  });

  if (res2) {
    console.log(res2.tree.children?.[0].value);
  }

  // 3. Deeply Nested Catchall Route
  const [res3, err3] = await apiFetch("/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]", {
    method: "GET",
  });

  // 4. Dynamic Params
  const [res4, err4] = await apiFetch("/api/users/[userId]", {
    method: "GET",
  });

  // 5. Auth Payload Inference
  const [res5, err5] = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username: "admin", password: "123" }),
  });

  // 6. Strict Method Checking
  // TypeScript will error if you try to use an unsupported HTTP method!
  const [res6, err6] = await apiFetch("/api/extreme/methods", {
    method: "DELETE", 
  });
}
