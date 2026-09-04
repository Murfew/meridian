"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ErrorContext } from "better-auth/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import LoadingButton from "@/components/loading-button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  name: z.string().min(1, { error: "Enter your full name" }),
  username: z.string().min(1, { error: "Enter your username" }),
  displayUsername: z.string().min(1, { error: "Enter you display name" }),
  email: z.email({ error: "Invalid email" }),
  password: z.string().min(8, { error: "Must be at least 8 characters" }),
});

type SignUpValues = z.infer<typeof schema>;

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      username: "",
      displayUsername: "",
      email: "",
      password: "",
    },
  });

  const handleSignUp = async (values: SignUpValues) => {
    const { data: availability } = await authClient.isUsernameAvailable({
      username: values.username,
    });

    if (!availability?.available) {
      form.setError("username", { message: "Username is already taken" });
      return;
    }

    const payload = {
      ...values,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    await authClient.signUp.email(
      { ...payload, callbackURL: "/availability" },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          router.push(
            `/verify-email?email=${encodeURIComponent(values.email)}`,
          );
        },
        onError: (ctx: ErrorContext) => {
          setLoading(false);
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-150 p-6">
        <form onSubmit={form.handleSubmit(handleSignUp)}>
          <FieldGroup>
            <div className="flex flex-col gap-1 text-center">
              <h1 className="font-heading text-2xl font-medium">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your details to get started with Meridian.
              </p>
            </div>

            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field data-invalid={!!form.formState.errors.name}>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    disabled={loading}
                    {...form.register("name")}
                  />
                  <FieldError errors={[form.formState.errors.name]} />
                </Field>
                <Field data-invalid={!!form.formState.errors.displayUsername}>
                  <FieldLabel htmlFor="displayUsername">
                    Display Name
                  </FieldLabel>
                  <Input
                    id="displayUsername"
                    placeholder="Jane Doe Hair Salon"
                    disabled={loading}
                    {...form.register("displayUsername")}
                  />
                  <FieldError
                    errors={[form.formState.errors.displayUsername]}
                  />
                </Field>
              </div>

              <Field data-invalid={!!form.formState.errors.username}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  placeholder="janedoe"
                  disabled={loading}
                  {...form.register("username")}
                />
                <FieldError errors={[form.formState.errors.username]} />
              </Field>

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

              <Field data-invalid={!!form.formState.errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                  id="password"
                  placeholder="Enter your password"
                  disabled={loading}
                  {...form.register("password")}
                />
                <FieldDescription>
                  Must be at least 8 characters.
                </FieldDescription>
                <FieldError errors={[form.formState.errors.password]} />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <LoadingButton type="submit" loading={loading} className="w-full">
                Create account
              </LoadingButton>
              <p className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </FieldGroup>
          </FieldGroup>
        </form>
      </Card>
    </div>
  );
}
