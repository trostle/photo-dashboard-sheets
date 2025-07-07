import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.VITE_GOOGLE_SHEETS_API_KEY": JSON.stringify(
        env.VITE_GOOGLE_SHEETS_API_KEY
      ),
      "process.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID": JSON.stringify(
        env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID
      ),
      "process.env.VITE_GOOGLE_SHEETS_RANGE": JSON.stringify(
        env.VITE_GOOGLE_SHEETS_RANGE
      ),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
