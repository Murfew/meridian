import { betterAuth, string } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import PasswordResetEmail from "@/emails/password-reset";
import VerificationEmail from "@/emails/verification";
import {
  EMAIL_VERIFICATION_TOKEN_DURATION,
  RESET_PASSWORD_TOKEN_DURATION,
} from "@/lib/contsants";
import { sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: {
    allowedHosts: [
      "meridianbooking.com",
      "www.meridianbooking.com",
      "*.vercel.app",
      "localhost:3000",
    ],
    protocol: "auto",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: RESET_PASSWORD_TOKEN_DURATION,

    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        react: PasswordResetEmail({ resetUrl: url }),
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
