import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import * as z from "zod";

const vercelSystemVariables = vercel();

export const env = createEnv({
  server: {
    STORAGE_DATABASE_URL: z.url({
      protocol: /^postgres(ql)?$/,
      error: "DATABASE_URL must be a postgres:// or postgresql:// URL",
    }),
    BETTER_AUTH_SECRET: z
      .string()
      .min(32, "BETTER_AUTH_SECRET must be at least 32 characters")
      .refine(
        (s) => new Set(s).size >= 10,
        "BETTER_AUTH_SECRET looks too low-entropy",
      ),
    RESEND_API_KEY: z
      .string()
      .startsWith("re_", "RESEND_API_KEY must start with 're_'")
      .min(20, "RESEND_API_KEY looks too short"),
    EMAIL_FROM: z.string().min(1),
    SENTRY_AUTH_TOKEN: vercelSystemVariables.VERCEL
      ? z.string().min(1)
      : z.string().optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  experimental__runtimeEnv: {},
  extends: [vercelSystemVariables],
  emptyStringAsUndefined: true,
});
