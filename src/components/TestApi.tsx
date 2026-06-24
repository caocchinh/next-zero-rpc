"use client";
import { apiFetch } from "@/lib/next-zero-rpc/apiClient";
import { useEffect, useState } from "react";

export default function TestApi() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  useEffect(() => {
    async function test() {
      addLog("Starting simple API tests...");

      // 1. Test POST /api/auth/login
      const [loginRes, loginErr] = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "admin@vinschool.edu.vn", password: "password" }),
      });

      if (loginRes) {
        addLog(`[POST /api/auth/login] Success:\n${JSON.stringify(loginRes.data, null, 2)}`);
      } else if (loginErr) {
        addLog(`[POST /api/auth/login] Error:\n${JSON.stringify(loginErr, null, 2)}`);
      }

      // 2. Test GET /api/users/[userId]
      const [userRes, userErr] = await apiFetch("/api/users/123", {
        method: "GET",
      });

      if (userRes) {
        addLog(`[GET /api/users/123] Success:\n${JSON.stringify(userRes.data, null, 2)}`);
      } else if (userErr) {
        addLog(`[GET /api/users/123] Error:\n${JSON.stringify(userErr, null, 2)}`);
      }

      // 3. Test DELETE /api/users/[userId] -> 204 No Content
      const [deleteRes, deleteErr] = await apiFetch("/api/users/123", {
        method: "DELETE",
      });

      if (!deleteErr) {
        addLog(`[DELETE /api/users/123] Success:\n204 No Content (Response: ${typeof deleteRes})`);
      } else {
        addLog(`[DELETE /api/users/123] Error:\n${JSON.stringify(deleteErr, null, 2)}`);
      }

      // 4. Test POST /api/orders/checkout
      const [orderRes, orderErr] = await apiFetch("/api/orders/checkout", {
        method: "POST",
        body: JSON.stringify({ ticketId: "tix_123", quantity: 2 }),
      });

      if (orderRes) {
        addLog(`[POST /api/orders/checkout] Success:\n${JSON.stringify(orderRes.data, null, 2)}`);
      } else if (orderErr) {
        addLog(`[POST /api/orders/checkout] Error:\n${JSON.stringify(orderErr, null, 2)}`);
      }

      addLog("Finished simple API tests.");
    }

    test();
  }, []);

  return (
    <div className="w-full overflow-x-auto rounded-lg border bg-gray-900 p-4 font-mono text-xs text-white">
      <h3 className="mb-2 font-bold text-green-400">Standard API Type Tests</h3>
      <ul className="space-y-4">
        {logs.map((log, i) => (
          <li key={i} className="whitespace-pre-wrap border-b border-gray-700 pb-2">{log}</li>
        ))}
      </ul>
    </div>
  );
}
