"use client";
import { apiFetch } from "@/lib/next-zero-rpc/apiClient";
import { useEffect, useState } from "react";

export function TestApiExtreme() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  useEffect(() => {
    async function testExtremeRoutes() {
      // Test complex types and type inference
      const [res, err] = await apiFetch("/api/extreme/complex-types", {
        method: "POST",
        body: JSON.stringify({ triggerError: false }),
      });

      if (err) {
        // Hover over `err` to see narrowed union of specific error codes!
        addLog(`[Error]:\n${JSON.stringify(err, null, 2)}`);
      } else if (res) {
        // Hover over `res` to see the exact return type inferred from the server!
        addLog(`[Success]:\n${JSON.stringify(res, null, 2)}`);
      }
    }

    testExtremeRoutes();
  }, []);

  return (
    <div className="w-full overflow-x-auto rounded-lg border bg-gray-900 p-4 font-mono text-xs text-white">
      <h3 className="mb-2 font-bold text-red-400">Next-Zero-RPC Inference Demo</h3>
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
