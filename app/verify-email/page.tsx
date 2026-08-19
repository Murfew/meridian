"use client";

import {
  Button,
  Card,
  Center,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function VerifyEmailPage() {
  const email = useSearchParams().get("email") ?? "";
  const [loading, setLoading] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);

  const handleResend = async () => {
    await authClient.sendVerificationEmail(
      {
        email,
        callbackURL: "/availability",
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
    setCooldown(30);
    const t = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(t);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

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
              We&apos;ve sent a verification link to {email}.
            </Text>
          </Stack>
          <Button
            variant="default"
            fullWidth
            onClick={handleResend}
            loading={loading}
            disabled={loading || cooldown > 0}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}{" "}
          </Button>
        </Stack>
      </Card>
    </Center>
  );
}
