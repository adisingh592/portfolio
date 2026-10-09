import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  clean: true,
  // Bundle the workspace package (it ships TypeScript source, not built JS)
  noExternal: ["@portfolio/shared"],
});
