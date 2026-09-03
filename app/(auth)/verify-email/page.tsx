"use client";

import type { ErrorContext } from "better-auth/client";
import { MailIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { LoadingButton } from "@/components/loading-button";
import { StatusIconBadge } from "@/components/status-icon-badge";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const email = useSearchParams().get("email") ?? "";
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async () => {
    await authClient.sendVerificationEmail(
      { email, callbackURL: "/availability" },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
        },
        onError: (ctx: ErrorContext) => {
          setLoading(false);
          toast.error(ctx.error.message);
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-105 items-center gap-6 p-6 text-center">
        <StatusIconBadge icon={<MailIcon />} />
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-medium">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a verification link to {email}.
          </p>
        </div>
        <LoadingButton
          variant="outline"
          className="w-full"
          onClick={handleResend}
          loading={loading}
          disabled={loading || cooldown > 0}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
        </LoadingButton>
      </Card>
    </div>
  );
}
