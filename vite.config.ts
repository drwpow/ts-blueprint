import react from "@vitejs/plugin-react-swc";
import { type Plugin, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react() as unknown as Plugin],
  test: {
    environment: "node",
    clearMocks: true,
    testTimeout: 10_000,
  },
});
