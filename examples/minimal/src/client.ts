import { apiFetch } from "@/lib/next-zero-rpc/apiClient";
import { assertNever } from "@/lib/next-zero-rpc/responses";

// 1. Precise Error Type Narrowing
const [data, err] = await apiFetch("/api/users/123", { method: "GET" });

if (err) {
  // TypeScript narrows the error code specifically to this route!
  const code = err.code;
  switch (code) {
    case "system:database-error":
      console.error("User not found!");
      break;
    // Intentionally missing 'system:unknown-error' to show TS error
    default:
      assertNever(code); // TS Error if you miss a case!
  }
} else {
  console.log(data.name);
}

// 2a. IDE IntelliSense: Available Routes
await apiFetch("", { method: "GET" });

// 2b. IDE IntelliSense: Allowed Methods
await apiFetch("/api/users/34", { method: "" });

// 3. Invalid Route (TypeScript catches typos!)
await apiFetch("/api/uwsers/34", { method: "DELETE" });

// 4. Invalid Method (TypeScript catches wrong methods!)
await apiFetch("/api/status", { method: "POST" });

// 5. Extreme Recursive Type Inference
const [res2, err2] = await apiFetch("/api/extreme/complex-types", { method: "POST" });

// 6. Deeply Nested Catch-All Routes
const [res3, err3] = await apiFetch("/api/extreme/acme/projects/xyz/tasks/a/b/c", {
  method: "GET",
});

// 7. Strict Method Matching
const [resGet, errGet] = await apiFetch("/api/extreme/methods", { method: "GET" });
