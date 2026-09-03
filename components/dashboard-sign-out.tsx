"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

export default function DashboardSignOut() {
  const router = useRouter();

  const handleSignOut = async () =>
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });

  return (
    <SidebarMenuButton tooltip="Sign out" onClick={handleSignOut}>
      <LogOutIcon />
      <span>Sign out</span>
    </SidebarMenuButton>
  );
}
