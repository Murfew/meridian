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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod/v4";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const schema = z
    .object({
      name: z.string().min(1, { error: "Enter your full name" }),
      username: z.string().min(1, { error: "Enter your username" }),
      displayUsername: z.string().min(1, { error: "Enter you display name" }),
      email: z.email({ error: "Invalid email" }),
      password: z.string().min(8, { error: "Must be at least 8 characters" }),
    })
    .superRefine(async (data, ctx) => {
      const { data: response } = await authClient.isUsernameAvailable(
        {
          username: data.username,
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            setLoading(false);
          },
          onError: (ctx) => {
            setLoading(false);
            alert(`Error (${ctx.error.status}): ${ctx.error.message}`);
          },
        },
      );

      if (!response?.available) {
        ctx.addIssue({
          code: "custom",
          message: "Username is already taken",
          path: ["username"],
        });
      }
    });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      username: "",
      displayUsername: "",
      email: "",
      password: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    validate: schemaResolver(schema, { sync: true }),
  });

  const handleSignUp = async () => {
    await authClient.signUp.email(
      { ...form.getValues(), callbackURL: "/availability" },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          router.push(
            `/verify-email?email=${encodeURIComponent(form.getValues().email)}`,
          );
        },
        onError: (ctx) => {
          setLoading(false);
          alert(`Error (${ctx.error.status}): ${ctx.error.message}`);
        },
      },
    );
  };

  return (
    <Center mih="100vh">
      <Card withBorder shadow="sm" padding="xl" w={600}>
        <form onSubmit={form.onSubmit(handleSignUp)}>
          <Stack gap="lg">
            <Stack gap={4}>
              <Title order={2} ta="center">
                Create an account
              </Title>
              <Text c="dimmed" size="sm" ta="center">
                Enter your details to get started with Meridian.
              </Text>
            </Stack>
            <Stack gap="md">
              <Group justify="space-between" grow>
                <TextInput
                  label="Full Name"
                  placeholder="Jane Doe"
                  withAsterisk
                  required
                  key={form.key("name")}
                  {...form.getInputProps("name")}
                  disabled={loading}
                />
                <TextInput
                  label="Display Name"
                  placeholder="Jane Doe Hair Salon"
                  withAsterisk
                  required
                  key={form.key("displayUsername")}
                  {...form.getInputProps("displayUsername")}
                  disabled={loading}
                />
              </Group>
              <TextInput
                label="Username"
                placeholder="janedoe"
                withAsterisk
                required
                key={form.key("username")}
                {...form.getInputProps("username")}
                disabled={loading}
              />
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
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                description="Must be at least 8 characters."
                withAsterisk
                required
                key={form.key("password")}
                {...form.getInputProps("password")}
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
                Create account
              </Button>
              <Text ta="center" size="sm">
                Already have an account?{" "}
                <Anchor href="/sign-in" size="sm" component={Link}>
                  Sign in
                </Anchor>
              </Text>
            </Stack>
          </Stack>
        </form>
      </Card>
    </Center>
  );
}
