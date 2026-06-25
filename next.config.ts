import type { NextConfig } from "next";
import { withApiRegistry } from "./src/lib/next-zero-rpc/update-api-registry.mjs";

const nextConfig: NextConfig = {
  logging: {
    browserToTerminal: false,
  },
};

export default withApiRegistry(nextConfig);
