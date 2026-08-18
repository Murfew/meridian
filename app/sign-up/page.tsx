"use client";

import {
  Anchor,
  Button,
  Card,
  Center,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import { useState } from "react";
import { z } from "zod/v4";
import { authClient } from "@/lib/auth-client";

export default function SignUp() {
  const [loading, setLoading] = useState<boolean>(false);

  const schema = z.object({
    email: z.email({ error: "Invalid email" }),
    password: z.string().min(8, { error: "Must be at least 8 characters" }),
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", password: "" },
    validate: schemaResolver(schema, { sync: true }),
  });

  const handleSignUp = async () => {
    await authClient.signUp.email(
      {},
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {},
        onError: (ctx) => {
          setLoading(false);
          form.setFieldError("email", ctx.error.message);
        },
      },
    );
  };

  return (
    <Center mih="100vh">
      <Card withBorder shadow="sm" padding="xl" w={400}>
        <form onSubmit={form.onSubmit(handleSignUp)}>
          <Stack gap="lg">
            <Stack gap={4}>
              <Title order={2}>Create an account</Title>
              <Text c="dimmed" size="sm">
                Enter your details to get started with Meridian.
              </Text>
            </Stack>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="you@example.com"
                type="email"
                withAsterisk
                key={form.key("email")}
                {...form.getInputProps("email")}
              />
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                description="Must be at least 8 characters."
                withAsterisk
                key={form.key("password")}
                {...form.getInputProps("password")}
              />
            </Stack>
            <Stack gap="md">
              <Button color="indigo" fullWidth type="submit" loading={loading}>
                Create account
              </Button>
              <Text ta="center" size="sm">
                Already have an account?{" "}
                <Anchor href="/sign-in" size="sm">
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
