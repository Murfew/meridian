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

export default function VerifyEmailPage() {
  const email = useSearchParams().get("email") ?? "";

  // TODO: handle resend logic (call auth resend endpoint, add loading/cooldown state, handle errors)
  const handleResend = () => {};

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
              {/* TODO: interpolate the actual email address once available, e.g. `We've sent a verification link to ${email}.` */}
              We&apos;ve sent a verification link to your email address.
            </Text>
          </Stack>
          <Button variant="default" fullWidth onClick={handleResend}>
            Resend email
          </Button>
        </Stack>
      </Card>
    </Center>
  );
}
