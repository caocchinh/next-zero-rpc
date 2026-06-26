import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["examples/*/src/**/*.test.ts"],
    typecheck: {
      enabled: true,
      // Use examples/minimal's own tsconfig — @/* alias already set up there
      tsconfig: "./examples/minimal/tsconfig.json",
    },
  },
});
