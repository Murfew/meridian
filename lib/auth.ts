import { betterAuth, getOrigin } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import { ExistingAccountEmail } from "@/emails/existing-account";
import { PasswordResetEmail } from "@/emails/password-reset";
import { VerificationEmail } from "@/emails/verification";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const EMAIL_VERIFICATION_TOKEN_DURATION = 60 * 60 * 24; // 24 hours
const RESET_PASSWORD_TOKEN_DURATION = 60 * 60; // 1 hour

const APP_HOSTS = [
  "www.meridianbooking.com",
  process.env.VERCEL_URL!,
  process.env.VERCEL_BRANCH_URL!,
];

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL:
    process.env.NODE_ENV === "production"
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
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        react: PasswordResetEmail({ resetUrl: url }),
      });
    },

    onExistingUserSignUp: async ({ user }, request) => {
      const origin =
        (request ? getOrigin(request.url) : null) ?? "www.meridianbooking.com";

      void sendEmail({
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
      void sendEmail({
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
