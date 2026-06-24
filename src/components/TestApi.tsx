import { apiFetch } from "@/lib/next-zero-rpc/apiClient";
import { useEffect } from "react";

export default function TestApi() {
  useEffect(() => {
    async function test() {
      // 1. Test POST /api/auth/login
      const [loginRes, loginErr] = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "admin@vinschool.edu.vn", password: "password" }),
      });

      if (loginRes) {
        console.log("Token:", loginRes.data?.token); // Should be type safe
        console.log("User:", loginRes.data?.user.email); // Should be type safe
      }

      if (loginErr) {
        // loginErr.code should be "validation:missing-required-fields" | "auth:invalid-student-credentials" | "validation:invalid-payload"
        console.log("Error:", loginErr.code);
      }

      // 2. Test GET /api/users/[userId]
      const [userRes, userErr] = await apiFetch("/api/users/123", {
        method: "GET",
      });

      if (userRes) {
        console.log("User Name:", userRes.data?.name); // Type safe
      }

      // 3. Test DELETE /api/users/[userId] -> 204 No Content
      const [deleteRes, deleteErr] = await apiFetch("/api/users/123", {
        method: "DELETE",
      });

      // deleteRes is undefined here but we check if it succeeded
      if (!deleteErr) {
        console.log("User deleted successfully");
      }

      // 4. Test POST /api/orders/checkout
      const [orderRes, orderErr] = await apiFetch("/api/orders/checkout", {
        method: "POST",
        body: JSON.stringify({ ticketId: "tix_123", quantity: 2 }),
      });

      if (orderRes) {
        console.log("Order ID:", orderRes.data?.orderId);
      }
    }

    test();
  }, []);

  return <div>Testing API</div>;
}
