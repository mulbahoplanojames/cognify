"use client";

import * as React from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Boxes,
  FileText,
  Github,
  LayoutDashboard,
  MessageCircle,
  Send,
  Settings2,
  Tag,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: false,
      items: [
        {
          title: "History",
          url: "#",
        },
      ],
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: Users,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
      ],
    },
    {
      title: "Content Moderation",
      url: "/admin/content",
      icon: FileText,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
      ],
    },
    {
      title: "Tags",
      url: "/admin/tags",
      icon: Tag,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
      ],
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: Boxes,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
      ],
    },
    {
      title: "Comments",
      url: "/admin/comments",
      icon: MessageCircle,
      items: [
        {
          title: "General",
          url: "#",
        },
      ],
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: AlertTriangle,
      items: [
        {
          title: "General",
          url: "#",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
      items: [
        {
          title: "General",
          url: "#",
        },
      ],
    },
    {
      title: "Notifications",
      url: "/admin/notifications",
      icon: Bell,
      items: [
        {
          title: "General",
          url: "#",
        },
      ],
    },
    {
      title: "Site Settings",
      url: "/admin/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Github",
      url: "https://github.com/cognify",
      icon: Github,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary dark:bg-white text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image src="/logo.png" alt="Logo" width={30} height={30} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Cognify</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
