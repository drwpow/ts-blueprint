import react from "@vitejs/plugin-react-swc";
import { defineConfig, type Plugin } from "vitest/config";

export default defineConfig({
  plugins: [react() as unknown as Plugin],
  test: {
    environment: "node",
    clearMocks: true,
  },
});
