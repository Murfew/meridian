import { drizzle } from "drizzle-orm/neon-serverless";
import { env } from "@/env";
import { relations } from "./relations";

export const db = drizzle({
  connection: env.STORAGE_DATABASE_URL,
  relations,
});
