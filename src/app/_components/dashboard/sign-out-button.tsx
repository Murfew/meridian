"use client";

import type { ErrorContext } from "better-auth/client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SidebarMenuButton } from "~/app/_components/ui/sidebar";
import { Spinner } from "~/app/_components/ui/spinner";
import { authClient } from "~/lib/auth-client";

export function DashboardSignOut() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () =>
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          router.push("/sign-in");
        },
        onError: (ctx: ErrorContext) => {
          setLoading(false);
          toast.error(ctx.error.message);
        },
      },
    });

  return (
    <SidebarMenuButton
      disabled={loading}
      onClick={handleSignOut}
      tooltip="Sign out"
    >
      {loading ? <Spinner /> : <LogOutIcon />}
      <span>Sign out</span>
    </SidebarMenuButton>
  );
}
