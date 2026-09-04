"use client";

import {
  CalendarCheckIcon,
  CalendarClockIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/availability", label: "Availability", icon: CalendarClockIcon },
  { href: "/bookings", label: "Bookings", icon: CalendarCheckIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            render={<Link href={item.href} />}
            tooltip={item.label}
            isActive={item.href === pathname}
          >
            <item.icon />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
