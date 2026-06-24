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
        addLog(
          `Login Success: Token: ${loginRes.data?.token.substring(0, 10)}... User: ${loginRes.data?.user.email}`,
        );
      }

      if (loginErr) {
        addLog(`Login Error: ${loginErr.code}`);
      }

      // 2. Test GET /api/users/[userId]
      const [userRes, userErr] = await apiFetch("/api/users/123", {
        method: "GET",
      });

      if (userRes) {
        addLog(`User Fetch Success: Name: ${userRes.data?.name}`);
      }

      // 3. Test DELETE /api/users/[userId] -> 204 No Content
      const [deleteRes, deleteErr] = await apiFetch("/api/users/123", {
        method: "DELETE",
      });

      // deleteRes is undefined here but we check if it succeeded
      if (!deleteErr) {
        addLog("User Delete Success: 204 No Content handled gracefully");
      }

      // 4. Test POST /api/orders/checkout
      const [orderRes, orderErr] = await apiFetch("/api/orders/checkout", {
        method: "POST",
        body: JSON.stringify({ ticketId: "tix_123", quantity: 2 }),
      });

      if (orderRes) {
        addLog(`Order Checkout Success: Order ID: ${orderRes.data?.orderId}`);
      }

      addLog("Finished simple API tests.");
    }

    test();
  }, []);

  return (
    <div className="w-full overflow-x-auto rounded-lg border bg-gray-900 p-4 font-mono text-xs text-white">
      <h3 className="mb-2 font-bold">Standard API Type Tests</h3>
      <ul className="space-y-1">
        {logs.map((log, i) => (
          <li key={i} className="whitespace-pre-wrap">{`> ${log}`}</li>
        ))}
      </ul>
    </div>
  );
}
