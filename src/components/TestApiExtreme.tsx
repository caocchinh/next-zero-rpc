"use client";
import { apiFetch } from "@/lib/next-zero-rpc/apiClient";
import { useEffect, useState } from "react";

export function TestApiExtreme() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  useEffect(() => {
    async function testExtremeRoutes() {
      // 1. Extreme deeply nested route with catchall
      const [res1, err1] = await apiFetch(
        "/api/extreme/org-123/projects/proj-abc/tasks/catch/all/segments",
        {
          method: "GET",
        },
      );

      if (err1) {
        addLog(`Error 1: ${err1.code}`);
      } else {
        // res1 should be strongly typed
        addLog(
          `Success 1: ${res1.data.resolvedOrgId} / matrix: ${res1.data.deeplyNestedMatrix.layer1.layer2.layer3[0][0].x}`,
        );
      }

      // 2. Extreme complex types
      const [res2, err2] = await apiFetch("/api/extreme/complex-types", {
        method: "POST",
        body: JSON.stringify({ triggerError: false }),
      });

      if (err2) {
        addLog(`Error 2: ${err2.message}`);
      } else {
        if (res2.data.union.type === "success") {
          addLog(
            `Success 2: Union is success! Metrics CPU: ${res2.data.union.payload.metrics.cpu[0]}`,
          );
        }
        addLog(`Success 2: Intersection base: ${res2.data.intersection.base}`);
        addLog(`Success 2: Tree root: ${res2.data.tree.value.type}`);
        addLog(`Success 2: matrix: ${res2.data.matrixStringTuple[2]}`);
      }

      // 3. Methods check
      const [resGet] = await apiFetch("/api/extreme/methods", { method: "GET" });
      addLog(`Methods GET: ${resGet?.data.method} - ${resGet?.data.data[2]}`);

      const [resPost] = await apiFetch("/api/extreme/methods", { method: "POST" });
      addLog(`Methods POST: ${resPost?.data.method} - ${resPost?.data.createdId}`);

      const [resPut] = await apiFetch("/api/extreme/methods", { method: "PUT" });
      addLog(`Methods PUT: ${resPut?.data.method} - updated: ${resPut?.data.updated}`);

      const [resDelete] = await apiFetch("/api/extreme/methods", { method: "DELETE" });
      addLog(`Methods DELETE: ${resDelete?.data.method} - deleted: ${resDelete?.data.deleted}`);

      const [resPatch] = await apiFetch("/api/extreme/methods", { method: "PATCH" });
      addLog(
        `Methods PATCH: ${resPatch?.data.method} - patched: ${resPatch?.data.patchedFields[0]}`,
      );

      // Since HEAD / OPTIONS return simple raw responses or No Content handling
      const [resHead] = await apiFetch("/api/extreme/methods", { method: "HEAD" });
      addLog(`Methods HEAD returned raw/empty: ${resHead === undefined ? "undefined" : "value"}`);
    }

    testExtremeRoutes();
  }, []);

  return (
    <div className="rounded-lg border bg-gray-900 p-4 font-mono text-xs text-white">
      <h3 className="mb-2 font-bold">Extreme API Type Tests</h3>
      <ul className="space-y-1">
        {logs.map((log, i) => (
          <li key={i}>{log}</li>
        ))}
      </ul>
    </div>
  );
}
