"use client";

import {
  Anchor,
  Button,
  Card,
  Center,
  PasswordInput,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { CheckCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import z from "zod";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const token = useSearchParams().get("token") ?? "";
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const schema = z
    .object({
      password: z.string().min(8, { error: "Must be at least 8 characters" }),
      confirmPassword: z.string().min(1, { error: "Confirm your password" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      error: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: schemaResolver(schema, { sync: true }),
  });

  const handleResetPassword = async () => {
    await authClient.resetPassword(
      {
        newPassword: form.getValues().password,
        token,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          setSubmitted(true);
        },
        onError: (ctx) => {
          setLoading(false);
          notifications.show({
            color: "red",
            title: "error",
            message: ctx.error.message,
          });
        },
      },
    );
  };

  if (submitted) {
    return (
      <Center mih="100vh">
        <Card withBorder shadow="sm" padding="xl" w={420}>
          <Stack gap="lg" align="center">
            <ThemeIcon size={56} radius="xl" color="green" variant="light">
              <CheckCircleIcon size={32} />
            </ThemeIcon>
            <Stack gap={4}>
              <Title order={2} ta="center">
                Password reset
              </Title>
              <Text c="dimmed" size="sm" ta="center">
                Your password has been updated. You can now sign in with your
                new password.
              </Text>
            </Stack>
            <Button color="indigo" fullWidth component={Link} href="/sign-in">
              Sign in
            </Button>
          </Stack>
        </Card>
      </Center>
    );
  }

  return (
    <Center mih="100vh">
      <Card withBorder shadow="sm" padding="xl" w={420}>
        <form onSubmit={form.onSubmit(handleResetPassword)}>
          <Stack gap="lg">
            <Stack gap={4}>
              <Title order={2} ta="center">
                Set a new password
              </Title>
              <Text c="dimmed" size="sm" ta="center">
                Choose a new password for your account.
              </Text>
            </Stack>
            <Stack gap="md">
              <PasswordInput
                label="New Password"
                placeholder="Enter your new password"
                withAsterisk
                required
                key={form.key("password")}
                {...form.getInputProps("password")}
                disabled={loading}
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="Re-enter your new password"
                withAsterisk
                required
                key={form.key("confirmPassword")}
                {...form.getInputProps("confirmPassword")}
                disabled={loading}
              />
            </Stack>
            <Stack gap="md">
              <Button
                color="indigo"
                fullWidth
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Reset password
              </Button>
              <Text ta="center" size="sm">
                <Anchor href="/sign-in" size="sm" component={Link}>
                  Back to sign in
                </Anchor>
              </Text>
            </Stack>
          </Stack>
        </form>
      </Card>
    </Center>
  );
}
