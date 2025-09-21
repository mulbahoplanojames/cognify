import { kpiCardsType } from "@/types/admin";
import { AlertTriangle, FileText, MessageCircle, Users } from "lucide-react";

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
