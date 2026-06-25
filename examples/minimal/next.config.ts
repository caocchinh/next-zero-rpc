import type { NextConfig } from "next";
import { withApiRegistry } from "./src/lib/next-zero-rpc/update-api-registry.mjs";

const nextConfig: NextConfig = {};

export default withApiRegistry(nextConfig);
