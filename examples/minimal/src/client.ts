import { apiFetch } from "@/lib/next-zero-rpc/apiClient";
import { assertNever } from "@/lib/next-zero-rpc/responses";

// 1. Happy Path — response is fully typed from your route handler
const [data, err] = await apiFetch("/api/users/123", { method: "GET" });

if (err) {
  console.error(err.message);
} else {
  // data.name, data.id, data.role — inferred directly from the route!
  console.log(data.name, data.role);
}

// 2. Exhaustive Error Narrowing
// TypeScript narrows err.code to exactly the codes this route can return.
// assertNever() is a compile-time guard — remove any case and TS errors.
const [data2, err2] = await apiFetch("/api/users/123", { method: "GET" });

if (err2) {
  const code = err2.code;
  switch (code) {
    case "system:database-error":
      console.error("User not found!");
      break;
    // Intentionally missing 'system:unknown-error' to show TS error
    default:
      assertNever(code); // TS Error if you miss a case!
  }
} else {
  console.log(data2.name);
}

// 3. TypeScript Catches Typos — compile error on an invalid route path
await apiFetch("/api/uwsers/34", { method: "DELETE" });

// 4. TypeScript Catches Wrong Methods — POST is not exported from /api/status
await apiFetch("/api/status", { method: "POST" });

// 5a. IDE IntelliSense: Available Routes
// Place cursor inside the string — your IDE lists every registered route.
await apiFetch("", { method: "GET" });

// 5b. IDE IntelliSense: Allowed Methods
// Place cursor inside method — your IDE narrows to only what this route exports.
await apiFetch("/api/users/34", { method: "" });

// 6. Static vs Dynamic Route Precedence
// /api/users/active matches the static route exactly — not the [userId] segment.
const [activeUsers, errActive] = await apiFetch("/api/users/active", { method: "GET" });

// /api/users/123 correctly resolves to the dynamic [userId] route.
const [singleUser, errSingle] = await apiFetch("/api/users/123", { method: "GET" });

// 7. Multi-Variable Template Literals
// All three runtime variables resolve independently — TypeScript still correctly
// matches the route /api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]
const orgId = "acme";
const projectId = "proj-99";
const catchall = "step1/step2/step3";
const [task, taskErr] = await apiFetch(
  `/api/extreme/${orgId}/projects/${projectId}/tasks/${catchall}`,
  { method: "GET" },
);

// 8. Deeply Nested Catch-All Routes
const [res3, err3] = await apiFetch("/api/extreme/acme/projects/xyz/tasks/a/b/c", {
  method: "GET",
});

// 9. Strict Method Matching — each method has its own unique response type
const [resGet, errGet] = await apiFetch("/api/extreme/methods", { method: "GET" });

// 10. Extreme Recursive Type Inference
// Discriminated unions, recursive trees, intersections — all preserved end-to-end.
const [res2, err2b] = await apiFetch("/api/extreme/complex-types", { method: "POST" });

// 11. Query Strings — safely stripped before validating the route path
const [withQuery, errQuery] = await apiFetch("/api/users/123?include=profile", { method: "GET" });
