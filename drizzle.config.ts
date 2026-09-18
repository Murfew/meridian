/** biome-ignore-all lint/style/noNonNullAssertion: Cannot use env var validation in config files */
import "dotenv/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle",
  schema: "./src/server/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.STORAGE_DATABASE_URL_UNPOOLED!,
  },
});
