"use client";

import {
  Anchor,
  Button,
  Card,
  Center,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import type { ErrorContext } from "better-auth/client";
import Link from "next/link";
import { useState } from "react";
import z from "zod";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const [loading, setLoading] = useState<boolean>(false);

  const schema = z.object({
    identifier: z.string().min(1, { error: "Enter your username or email" }),
    password: z.string().min(1, { error: "Enter your password" }),
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      identifier: "",
      password: "",
    },
    validate: schemaResolver(schema, { sync: true }),
  });

  const handleSignIn = async () => {
    const options = {
      onRequest: () => {
        setLoading(true);
      },
      onSuccess: () => {
        setLoading(false);
      },
      onError: (ctx: ErrorContext) => {
        setLoading(false);
        form.setFieldValue("password", "");
        notifications.show({
          color: "red",
          title: "error",
          message: ctx.error.message,
        });
      },
    };

    const { identifier, password } = form.getValues();
    const callbackURL = "/availability";

    if (identifier.includes("@")) {
      await authClient.signIn.email(
        {
          email: identifier,
          password,
          callbackURL,
        },
        options,
      );
    } else {
      await authClient.signIn.username(
        {
          username: identifier,
          password,
          callbackURL,
        },
        options,
      );
    }
  };

  return (
    <Center mih="100vh">
      <Card withBorder shadow="sm" padding="xl" w={420}>
        <form onSubmit={form.onSubmit(handleSignIn)}>
          <Stack gap="lg">
            <Stack gap={4}>
              <Title order={2} ta="center">
                Welcome back
              </Title>
              <Text c="dimmed" size="sm" ta="center">
                Sign in to your Meridian account.
              </Text>
            </Stack>
            <Stack gap="md">
              <TextInput
                label="Username or Email"
                placeholder="janedoe or you@example.com"
                withAsterisk
                required
                key={form.key("identifier")}
                {...form.getInputProps("identifier")}
                disabled={loading}
              />
              <Stack gap={4}>
                <Group justify="space-between">
                  <Text component="label" size="sm" fw={500}>
                    Password
                  </Text>
                  <Anchor href="/forgot-password" size="xs" component={Link}>
                    Forgot your password?
                  </Anchor>
                </Group>
                <PasswordInput
                  placeholder="Enter your password"
                  withAsterisk
                  required
                  key={form.key("password")}
                  {...form.getInputProps("password")}
                  disabled={loading}
                />
              </Stack>
            </Stack>
            <Stack gap="md">
              <Button
                color="indigo"
                fullWidth
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Sign in
              </Button>
              <Text ta="center" size="sm">
                Don&apos;t have an account?{" "}
                <Anchor href="/sign-up" size="sm" component={Link}>
                  Sign up
                </Anchor>
              </Text>
            </Stack>
          </Stack>
        </form>
      </Card>
    </Center>
  );
}
