import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/unit/**/*.test.ts"]
  },
  resolve: {
    alias: {
      "@": srcPath,
      "@/*": path.join(srcPath, "*")
    }
  }
});
