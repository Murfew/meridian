import {
  CalendarCheckIcon,
  CalendarClockIcon,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import requireUser from "@/lib/auth-guard";

const navItems = [
  { href: "/availability", label: "Availability", icon: CalendarClockIcon },
  { href: "/bookings", label: "Bookings", icon: CalendarCheckIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link
            href="/"
            className="px-2 py-1.5 font-heading text-sm font-medium"
          >
            Meridian
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    {/* TODO: mark the current route active — compare the
                        current pathname to item.href and pass the result as
                        `isActive` below (needs a client component). */}
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              {/* TODO: wire this up to sign the user out (authClient.signOut
                  from lib/auth-client.ts) and redirect to /sign-in. */}
              <SidebarMenuButton tooltip="Sign out">
                <LogOutIcon />
                <span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
