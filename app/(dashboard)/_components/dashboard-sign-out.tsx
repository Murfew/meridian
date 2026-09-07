"use client";

import type { ErrorContext } from "better-auth/client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

export default function DashboardSignOut() {
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
      tooltip="Sign out"
      onClick={handleSignOut}
      disabled={loading}
    >
      {loading ? <Spinner /> : <LogOutIcon />}
      <span>Sign out</span>
    </SidebarMenuButton>
  );
}
