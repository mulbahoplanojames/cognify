import { fetchPosts, fetchUsers } from "@/helpers/fetch-users";
import { kpiCardsType } from "@/types/admin";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Flag,
  MessageCircle,
  Settings,
  Users,
  XCircle,
} from "lucide-react";

//Todo: Replace with actual data in future updates

// This function fetches users from the helpers file
const users = await fetchUsers();
const posts = await fetchPosts();

const stats = {
  users: {
    total: users?.length,
    newThisMonth: users?.filter(
      (user) =>
        user.createdAt >=
        new Date(new Date().setMonth(new Date().getMonth() - 1))
    ).length,
    newUserThisMonth: users?.filter(
      (user) =>
        user.createdAt >=
        new Date(new Date().setMonth(new Date().getMonth() - 1))
    ).length,
  },
  posts: {
    postThisWeek: posts?.filter(
      (post) =>
        post.createdAt >=
        new Date(new Date().setMonth(new Date().getMonth() - 1))
    ).length,
    published: posts?.filter((post) => post.status === "PUBLISHED")?.length,
    publishedThisMonth: posts?.filter(
      (post) =>
        post.status === "PUBLISHED" &&
        post.createdAt >=
          new Date(new Date().setMonth(new Date().getMonth() - 1))
    ).length,
    drafts: posts?.filter((post) => post.status === "DRAFT")?.length,
    pending: posts?.filter((post) => post.status === "PENDING")?.length,
    approvePublishToday: posts?.filter(
      (post) =>
        post.status === "PUBLISHED" &&
        post.updatedAt >= new Date(new Date().setDate(new Date().getDate() - 1))
    ).length,
    rejectedPublishToday: posts?.filter(
      (post) =>
        post.status === "DRAFT" &&
        post.updatedAt >= new Date(new Date().setDate(new Date().getDate() - 1))
    ).length,
  },
  comments: { total: 1856, pending: 12 },
  reports: { open: 7, newThisWeek: 3 },
};

export const kpiCards: kpiCardsType[] = [
  {
    title: "Active Users",
    value: stats?.users?.total || 0,
    change: "+12%",
    changeType: "positive" as const,
    description: `${stats?.users?.newThisMonth || 0} new this month`,
    icon: Users,
  },
  {
    title: "Published Posts",
    value: stats?.posts?.published || 0,
    change: "+8%",
    changeType: "positive" as const,
    description: `${stats?.posts?.drafts || 0} drafts pending`,
    icon: FileText,
  },
  {
    title: "Total Comments",
    value: stats?.comments?.total || 0,
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
    action: `${stats?.users?.newThisMonth || 0} new users this month`,
    user: users?.map((user) => user.name).join(", "),
    time: new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date()),
    type: "user",
  },
  {
    action: `${
      stats?.posts?.publishedThisMonth || 0
    } Post published this month`,
    user: "",
    time: new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date()),
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

// Todo: This is a placeholder data for moderation queue
export const moderationQueue = [
  {
    title: "Approved Today",
    value: stats?.posts?.approvePublishToday || 0,
    icon: CheckCircle,
    change: "+8%",
    changeType: "positive" as const,
    description: "24 posts approved today",
    color: "green-600",
  },
  {
    title: "Pending Review",
    value: stats?.posts?.pending || 0,
    icon: Clock,
    change: "+2%",
    changeType: "positive" as const,
    description: "7 posts pending review",
    color: "yellow-600",
  },
  {
    title: "Rejected Today",
    value: stats?.posts?.rejectedPublishToday || 0,
    icon: XCircle,
    change: "-5%",
    changeType: "negative" as const,
    description: "3 posts rejected today",
    color: "red-600",
  },
];
