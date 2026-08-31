"use client";

import {
  Anchor,
  Button,
  Card,
  Center,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import z from "zod";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const schema = z.object({
    email: z.email({ error: "Invalid email" }),
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
    },
    validate: schemaResolver(schema, { sync: true }),
  });

  const handleForgotPassword = async () => {
    await authClient.requestPasswordReset(
      {
        email: form.getValues().email,
        redirectTo: "/reset-password",
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
            <ThemeIcon size={56} radius="xl" color="indigo" variant="light">
              <EnvelopeSimpleIcon size={32} />
            </ThemeIcon>
            <Stack gap={4}>
              <Title order={2} ta="center">
                Check your email
              </Title>
              <Text c="dimmed" size="sm" ta="center">
                We&apos;ve sent a password reset link to{" "}
                {form.getValues().email}.
              </Text>
            </Stack>
            <Anchor href="/sign-in" size="sm" component={Link}>
              Back to sign in
            </Anchor>
          </Stack>
        </Card>
      </Center>
    );
  }

  return (
    <Center mih="100vh">
      <Card withBorder shadow="sm" padding="xl" w={420}>
        <form onSubmit={form.onSubmit(handleForgotPassword)}>
          <Stack gap="lg">
            <Stack gap={4}>
              <Title order={2} ta="center">
                Forgot your password?
              </Title>
              <Text c="dimmed" size="sm" ta="center">
                Enter your email and we&apos;ll send you a link to reset it.
              </Text>
            </Stack>
            <TextInput
              label="Email"
              placeholder="you@example.com"
              type="email"
              withAsterisk
              required
              key={form.key("email")}
              {...form.getInputProps("email")}
              disabled={loading}
            />
            <Stack gap="md">
              <Button
                color="indigo"
                fullWidth
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Send reset link
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
