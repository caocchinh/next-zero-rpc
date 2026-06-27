#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// Map file paths to their export variable names
const FILE_MAPPINGS = [
  {
    path: "examples/minimal/src/app/api/(core)/status/route.ts",
    varName: "APP_API_CORE_STATUS_ROUTE_TS_CODE",
  },
  {
    path: "examples/minimal/src/app/api/auth/login/route.ts",
    varName: "APP_API_AUTH_LOGIN_ROUTE_TS_CODE",
  },
  {
    path: "examples/minimal/src/app/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]/route.ts",
    varName: "APP_API_EXTREME_ORGID_PROJECTS_PROJECTID_TASKS_CATCHALL_ROUTE_TS_CODE",
  },
  {
    path: "examples/minimal/src/app/api/extreme/complex-types/route.ts",
    varName: "APP_API_EXTREME_COMPLEX_TYPES_ROUTE_TS_CODE",
  },
  {
    path: "examples/minimal/src/app/api/extreme/methods/route.ts",
    varName: "APP_API_EXTREME_METHODS_ROUTE_TS_CODE",
  },
  {
    path: "examples/minimal/src/app/api/users/active/route.ts",
    varName: "APP_API_USERS_ACTIVE_ROUTE_TS_CODE",
  },
  {
    path: "examples/minimal/src/app/api/users/[userId]/route.ts",
    varName: "APP_API_USERS_USERID_ROUTE_TS_CODE",
  },
  {
    path: "examples/minimal/src/lib/next-zero-rpc/apiClient.ts",
    varName: "LIB_NEXT_ZERO_RPC_APICLIENT_TS_CODE",
  },
  {
    path: "examples/minimal/src/lib/next-zero-rpc/apiRegistry.ts",
    varName: "LIB_NEXT_ZERO_RPC_APIREGISTRY_TS_CODE",
  },
  {
    path: "examples/minimal/src/lib/next-zero-rpc/responses.ts",
    varName: "LIB_NEXT_ZERO_RPC_RESPONSES_TS_CODE",
  },
  {
    path: "examples/minimal/src/lib/next-zero-rpc/update-api-registry.mjs",
    varName: "LIB_NEXT_ZERO_RPC_UPDATE_API_REGISTRY_MJS_CODE",
  },
  {
    path: "examples/minimal/src/lib/next-zero-rpc/path-inference.test.ts",
    varName: "LIB_NEXT_ZERO_RPC_PATH_INFERENCE_TEST_TS_CODE",
  },
  {
    path: "examples/minimal/vitest.config.ts",
    varName: "VITEST_CONFIG_TS_CODE",
  },
];

function escapeTemplateString(content) {
  // Escape backticks and ${} expressions in template literals
  return content.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

function generateCodeData() {
  let output = "// AUTO-GENERATED FILE - Do not edit manually\n";
  output += "// Run 'pnpm update-codedata' to regenerate this file\n\n";

  const errors = [];

  for (const mapping of FILE_MAPPINGS) {
    const filePath = path.join(projectRoot, mapping.path);

    try {
      if (!fs.existsSync(filePath)) {
        errors.push(`File not found: ${mapping.path}`);
        console.warn(`⚠️  File not found: ${mapping.path}`);
        continue;
      }

      const content = fs.readFileSync(filePath, "utf-8");
      const escapedContent = escapeTemplateString(content);

      output += `export const ${mapping.varName} = \`${escapedContent}\`;\n\n`;
      console.log(`✅ Processed: ${mapping.path}`);
    } catch (error) {
      errors.push(`Error processing ${mapping.path}: ${error.message}`);
      console.error(`❌ Error processing ${mapping.path}:`, error.message);
    }
  }

  const outputPath = path.join(projectRoot, "src/components/CodeData.ts");
  fs.writeFileSync(outputPath, output, "utf-8");

  console.log(`\n✨ CodeData.ts generated successfully at ${outputPath}`);

  if (errors.length > 0) {
    console.log("\n⚠️  Warnings:");
    errors.forEach((err) => console.log(`   ${err}`));
  }

  console.log(`\n📊 Processed ${FILE_MAPPINGS.length - errors.length}/${FILE_MAPPINGS.length} files`);
}

generateCodeData();
