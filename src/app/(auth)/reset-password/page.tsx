"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ErrorContext } from "better-auth/client";
import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { LoadingButton } from "@/components/loading-button";
import { StatusIconBadge } from "@/components/status-icon-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";

const schema = z
  .object({
    password: z.string().min(8, { error: "Must be at least 8 characters" }),
    confirmPassword: z.string().min(1, { error: "Confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const token = useSearchParams().get("token") ?? "";
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const handleResetPassword = async (values: ResetPasswordValues) => {
    await authClient.resetPassword(
      { newPassword: values.password, token },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
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
          <StatusIconBadge icon={<CheckCircle2Icon />} variant="success" />
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-2xl font-medium">
              Password reset
            </h1>
            <p className="text-sm text-muted-foreground">
              Your password has been updated. You can now sign in with your new
              password.
            </p>
          </div>
          <Button render={<Link href="/sign-in" />} className="w-full">
            Sign in
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-105 p-6">
        <form onSubmit={form.handleSubmit(handleResetPassword)}>
          <FieldGroup>
            <div className="flex flex-col gap-1 text-center">
              <h1 className="font-heading text-2xl font-medium">
                Set a new password
              </h1>
              <p className="text-sm text-muted-foreground">
                Choose a new password for your account.
              </p>
            </div>

            <FieldGroup>
              <Field data-invalid={!!form.formState.errors.password}>
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <PasswordInput
                  id="password"
                  placeholder="Enter your new password"
                  disabled={loading}
                  {...form.register("password")}
                />
                <FieldError errors={[form.formState.errors.password]} />
              </Field>
              <Field data-invalid={!!form.formState.errors.confirmPassword}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Re-enter your new password"
                  disabled={loading}
                  {...form.register("confirmPassword")}
                />
                <FieldError errors={[form.formState.errors.confirmPassword]} />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <LoadingButton type="submit" loading={loading} className="w-full">
                Reset password
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
