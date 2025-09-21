import { kpiCardsType } from "@/types/admin";
import {
  AlertTriangle,
  FileText,
  MessageCircle,
  Settings,
  Users,
} from "lucide-react";

//Todo: Replace with actual data in future updates
const stats = {
  users: { total: 1247, newThisMonth: 89 },
  posts: { published: 342, drafts: 23 },
  comments: { total: 1856, pending: 12 },
  reports: { open: 7, newThisWeek: 3 },
};

export const kpiCards: kpiCardsType[] = [
  {
    title: "Active Users",
    value: stats.users.total,
    change: "+12%",
    changeType: "positive" as const,
    description: `${stats.users.newThisMonth} new this month`,
    icon: Users,
  },
  {
    title: "Published Posts",
    value: stats.posts.published,
    change: "+8%",
    changeType: "positive" as const,
    description: `${stats.posts.drafts} drafts pending`,
    icon: FileText,
  },
  {
    title: "Total Comments",
    value: stats.comments.total,
    change: "+23%",
    changeType: "positive" as const,
    description: `${stats.comments.pending} awaiting moderation`,
    icon: MessageCircle,
  },
  {
    title: "Open Reports",
    value: stats.reports.open,
    change: "-5%",
    changeType: "negative" as const,
    description: `${stats.reports.newThisWeek} new this week`,
    icon: AlertTriangle,
  },
];

//Todo: Replace with actual data in future updates
export const recentActivity = [
  {
    action: "New user registered",
    user: "john.doe@example.com",
    time: "2 minutes ago",
    type: "user",
  },
  {
    action: "Post published",
    user: "Jane Smith",
    time: "15 minutes ago",
    type: "content",
  },
  {
    action: "Comment reported",
    user: "Anonymous",
    time: "1 hour ago",
    type: "report",
  },
  {
    action: "User role updated",
    user: "mike.wilson@example.com",
    time: "2 hours ago",
    type: "admin",
  },
];

// Todo: Quick actions
export const quickActions = [
  {
    title: "Manage Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Review Comments",
    icon: MessageCircle,
    href: "/admin/comments",
  },
  {
    title: "Handle Reports",
    icon: AlertTriangle,
    href: "/admin/reports",
  },
  {
    title: "Site Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];
