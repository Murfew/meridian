"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ErrorContext } from "better-auth/client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { LoadingButton } from "@/components/loading-button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  identifier: z.string().min(1, { error: "Enter your username or email" }),
  password: z.string().min(1, { error: "Enter your password" }),
});

type SignInValues = z.infer<typeof schema>;

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(schema),
    defaultValues: { identifier: "", password: "" },
  });

  const handleSignIn = async (values: SignInValues) => {
    const options = {
      onRequest: () => {
        setLoading(true);
      },
      onSuccess: () => {
        setLoading(false);
      },
      onError: (ctx: ErrorContext) => {
        setLoading(false);
        form.resetField("password");
        toast.error(ctx.error.message);
      },
    };

    const { identifier, password } = values;
    const callbackURL = "/availability";

    if (identifier.includes("@")) {
      await authClient.signIn.email(
        { email: identifier, password, callbackURL },
        options,
      );
    } else {
      await authClient.signIn.username(
        { username: identifier, password, callbackURL },
        options,
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-105 p-6">
        <form onSubmit={form.handleSubmit(handleSignIn)}>
          <FieldGroup>
            <div className="flex flex-col gap-1 text-center">
              <h1 className="font-heading text-2xl font-medium">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your Meridian account.
              </p>
            </div>

            <FieldGroup>
              <Field data-invalid={!!form.formState.errors.identifier}>
                <FieldLabel htmlFor="identifier">Username or Email</FieldLabel>
                <Input
                  id="identifier"
                  placeholder="janedoe or you@example.com"
                  disabled={loading}
                  {...form.register("identifier")}
                />
                <FieldError errors={[form.formState.errors.identifier]} />
              </Field>

              <Field data-invalid={!!form.formState.errors.password}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  placeholder="Enter your password"
                  disabled={loading}
                  {...form.register("password")}
                />
                <FieldError errors={[form.formState.errors.password]} />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <LoadingButton type="submit" loading={loading} className="w-full">
                Sign in
              </LoadingButton>
              <p className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </FieldGroup>
          </FieldGroup>
        </form>
      </Card>
    </div>
  );
}
