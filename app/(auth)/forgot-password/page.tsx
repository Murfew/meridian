"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ErrorContext } from "better-auth/client";
import { MailIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { LoadingButton } from "@/components/loading-button";
import { StatusIconBadge } from "@/components/status-icon-badge";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  email: z.email({ error: "Invalid email" }),
});

type ForgotPasswordValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const handleForgotPassword = async (values: ForgotPasswordValues) => {
    await authClient.requestPasswordReset(
      { email: values.email, redirectTo: "/reset-password" },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setSentTo(values.email);
          setSubmitted(true);
        },
        onError: (ctx: ErrorContext) => {
          setLoading(false);
          toast.error(ctx.error.message);
        },
      },
    );
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-105 items-center gap-6 p-6 text-center">
          <StatusIconBadge icon={<MailIcon />} />
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-2xl font-medium">
              Check your email
            </h1>
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent a password reset link to {sentTo}.
            </p>
          </div>
          <Link
            href="/sign-in"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-105 p-6">
        <form onSubmit={form.handleSubmit(handleForgotPassword)}>
          <FieldGroup>
            <div className="flex flex-col gap-1 text-center">
              <h1 className="font-heading text-2xl font-medium">
                Forgot your password?
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and we&apos;ll send you a link to reset it.
              </p>
            </div>

            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                disabled={loading}
                {...form.register("email")}
              />
              <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <FieldGroup>
              <LoadingButton type="submit" loading={loading} className="w-full">
                Send reset link
              </LoadingButton>
              <Link
                href="/sign-in"
                className="text-center text-sm text-primary underline-offset-4 hover:underline"
              >
                Back to sign in
              </Link>
            </FieldGroup>
          </FieldGroup>
        </form>
      </Card>
    </div>
  );
}
