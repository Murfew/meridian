import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth, getOrigin } from "better-auth";
import { username } from "better-auth/plugins";
import { after } from "next/server";
import { ExistingAccountEmail } from "@/emails/existing-account";
import { PasswordResetEmail } from "@/emails/password-reset";
import { VerificationEmail } from "@/emails/verification";
import { env } from "@/env";
import { db } from "@/server/db";
import { schema } from "@/server/db/schema";
import { sendEmail } from "@/server/email";

const EMAIL_VERIFICATION_TOKEN_DURATION = 60 * 60 * 24; // 24 hours
const RESET_PASSWORD_TOKEN_DURATION = 60 * 60; // 1 hour

const APP_URL = "www.meridianbooking.com";

const APP_HOSTS = [APP_URL, env.VERCEL_URL, env.VERCEL_BRANCH_URL].filter(
  (host) => host !== undefined,
);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
  advanced: {
    backgroundTasks: {
      handler: after,
    },
    database: {
      joins: true,
    },
  },
  baseURL:
    env.NODE_ENV === "production"
      ? {
          allowedHosts: APP_HOSTS,
          protocol: "https",
        }
      : {
          allowedHosts: [...APP_HOSTS, "localhost:3000"],
          protocol: "http",
        },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: RESET_PASSWORD_TOKEN_DURATION,
    revokeSessionsOnPasswordReset: true,

    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        react: PasswordResetEmail({ resetUrl: url }),
      });
    },

    onExistingUserSignUp: async ({ user }, request) => {
      const origin =
        (request ? getOrigin(request.url) : null) ?? `https://${APP_URL}`;

      await sendEmail({
        to: user.email,
        subject: "You already have an account",
        react: ExistingAccountEmail({
          signInUrl: `${origin}/sign-in`,
          resetPasswordUrl: `${origin}/forgot-password`,
        }),
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: EMAIL_VERIFICATION_TOKEN_DURATION,

    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        react: VerificationEmail({ verificationUrl: url }),
      });
    },
  },
  plugins: [username()],
  user: {
    additionalFields: {
      description: { type: "string", required: false, defaultValue: "" },
      timezone: {
        type: "string",
        required: true,
        defaultValue: "America/Montreal",
      },
      defaultDurationMinutes: {
        type: "number",
        required: true,
        defaultValue: 30,
      },
      bufferMinutes: { type: "number", required: true, defaultValue: 0 },
    },
  },
});
