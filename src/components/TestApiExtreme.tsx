"use client";
import { apiFetch } from "@/lib/next-zero-rpc/apiClient";
import { assertNever } from "@/lib/next-zero-rpc/responses";
import { useEffect, useState } from "react";

export function TestApiExtreme() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  useEffect(() => {
    async function testExtremeRoutes() {
      // 1. Extreme deeply nested route with catchall
      const [res1, err1] = await apiFetch("/api/users/34", {
        method: "DELETE",
      });

      if (err1) {
        const code = err1.code;
        switch (code) {
          case "system:unknown-error":
            console.log("ok");
            break;
          case "auth:forbidden":
            console.log("ok2");
            break;
          default:
            assertNever(code);
        }
      }

      if (err1) {
        addLog(
          `[GET /api/extreme/.../catch/all/segments] Error:\n${JSON.stringify(err1, null, 2)}`,
        );
      } else if (res1) {
        addLog(
          `[GET /api/extreme/.../catch/all/segments] Success:\n${JSON.stringify(res1, null, 2)}`,
        );
      }

      // 2. Extreme complex types
      const [res2, err2] = await apiFetch("/api/extreme/complex-types", {
        method: "POST",
        body: JSON.stringify({ triggerError: false }),
      });

      if (err2) {
        addLog(`[POST /api/extreme/complex-types] Error:\n${JSON.stringify(err2, null, 2)}`);
      } else if (res2) {
        addLog(`[POST /api/extreme/complex-types] Success:\n${JSON.stringify(res2, null, 2)}`);
      }

      // 3. Methods check
      const [resGet, errGet] = await apiFetch("/api/extreme/methods", { method: "GET" });
      addLog(
        `[GET /api/extreme/methods] ${resGet ? "Success:" : "Error:"}\n${JSON.stringify(resGet || errGet, null, 2)}`,
      );

      const [resPost, errPost] = await apiFetch("/api/extreme/methods", { method: "POST" });
      addLog(
        `[POST /api/extreme/methods] ${resPost ? "Success:" : "Error:"}\n${JSON.stringify(resPost || errPost, null, 2)}`,
      );

      const [resPut, errPut] = await apiFetch("/api/extreme/methods", { method: "PUT" });
      addLog(
        `[PUT /api/extreme/methods] ${resPut ? "Success:" : "Error:"}\n${JSON.stringify(resPut || errPut, null, 2)}`,
      );

      const [resDelete, errDelete] = await apiFetch("/api/extreme/methods", { method: "DELETE" });
      addLog(
        `[DELETE /api/extreme/methods] ${resDelete ? "Success:" : "Error:"}\n${JSON.stringify(resDelete || errDelete, null, 2)}`,
      );

      const [resPatch, errPatch] = await apiFetch("/api/extreme/methods", { method: "PATCH" });
      addLog(
        `[PATCH /api/extreme/methods] ${resPatch ? "Success:" : "Error:"}\n${JSON.stringify(resPatch || errPatch, null, 2)}`,
      );

      // Since HEAD / OPTIONS return simple raw responses or No Content handling
      const [resHead, errHead] = await apiFetch("/api/extreme/methods", { method: "HEAD" });
      addLog(
        `[HEAD /api/extreme/methods] ${!errHead ? "Success:" : "Error:"}\n${!errHead ? `Response: ${typeof resHead}` : JSON.stringify(errHead, null, 2)}`,
      );
    }

    testExtremeRoutes();
  }, []);

  return (
    <div className="w-full overflow-x-auto rounded-lg border bg-gray-900 p-4 font-mono text-xs text-white">
      <h3 className="mb-2 font-bold text-red-400">Extreme API Type Tests</h3>
      <ul className="space-y-4">
        {logs.map((log, i) => (
          <li key={i} className="border-b border-gray-700 pb-2 whitespace-pre-wrap">
            {log}
          </li>
        ))}
      </ul>
    </div>
  );
}
