import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/components/ui/index.ts"],
  format: ["esm", "cjs"],
  tsconfig: "tsconfig.build.json",
  dts: true,
  splitting: false,
  clean: true,
  outDir: "dist",
  external: ["react", "react-dom"],
  banner: {
    js: '"use client";',
  },
});
