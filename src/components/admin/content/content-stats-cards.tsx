import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Post } from "@/lib/prisma";
import { Eye, Clock, Flag, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ContentStatsCards() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/v1/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        console.log("Post for moderaate", data);
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        toast.error("Error", {
          description: "Failed to load posts",
        });
      }
    };

    fetchPosts();
  }, []);

  const stats = {
    posts: {
      total: posts?.length,
      drafts: posts?.filter((post) => post.status === "DRAFT")?.length,
      draftsFromPreviousDays: posts?.filter((post) => {
        if (post.status !== "DRAFT") return false;
        if (!post.publishedAt) return false;

        const today = new Date();
        const postDate = new Date(post.publishedAt);

        return (
          postDate.getDate() === today.getDate() - 1 &&
          postDate.getMonth() === today.getMonth() &&
          postDate.getFullYear() === today.getFullYear()
        );
      })?.length,
      pending: posts?.filter((post) => post.status === "PENDING")?.length,
      pendingFromPreviousDays: posts?.filter((post) => {
        if (post.status !== "PENDING") return false;
        if (!post.publishedAt) return false;

        const today = new Date();
        const postDate = new Date(post.publishedAt);

        return (
          postDate.getDate() === today.getDate() - 1 &&
          postDate.getMonth() === today.getMonth() &&
          postDate.getFullYear() === today.getFullYear()
        );
      })?.length,
      published: posts?.filter((post) => post.status === "PUBLISHED")?.length,
      scheduled: posts?.filter((post) => post.status === "SCHEDULED")?.length,
      scheduledFromPreviousDays: posts?.filter((post) => {
        if (post.status !== "SCHEDULED") return false;
        if (!post.publishedAt) return false;

        const today = new Date();
        const postDate = new Date(post.publishedAt);

        return (
          postDate.getDate() === today.getDate() - 1 &&
          postDate.getMonth() === today.getMonth() &&
          postDate.getFullYear() === today.getFullYear()
        );
      })?.length,
      publishToday: posts?.filter((post) => {
        if (post.status !== "PUBLISHED") return false;
        if (!post.publishedAt) return false;

        const today = new Date();
        const postDate = new Date(post.publishedAt);

        return (
          postDate.getDate() === today.getDate() &&
          postDate.getMonth() === today.getMonth() &&
          postDate.getFullYear() === today.getFullYear()
        );
      })?.length,
      publishedFromPreviousDays: posts?.filter((post) => {
        if (post.status !== "PUBLISHED") return false;
        if (!post.publishedAt) return false;

        const today = new Date();
        const postDate = new Date(post.publishedAt);

        return (
          postDate.getDate() === today.getDate() - 1 &&
          postDate.getMonth() === today.getMonth() &&
          postDate.getFullYear() === today.getFullYear()
        );
      })?.length,
    },
  };

  const contentStats = [
    {
      title: "Total Posts",
      value: stats?.posts?.total || 0,
      icon: Eye,
      change: "+12% from last month",
    },
    {
      title: "Drafts",
      value: stats?.posts?.drafts || 0,
      icon: CheckCircle,
      change: `+${stats?.posts?.draftsFromPreviousDays || 0} from yesterday`,
    },
    {
      title: "Pending Review",
      value: stats?.posts?.pending || 0,
      icon: Clock,
      change: `+${stats?.posts?.pendingFromPreviousDays || 0} from yesterday`,
    },
    {
      title: "Scheduled Content",
      value: stats?.posts?.scheduled || 0,
      icon: Flag,
      change: `+${stats?.posts?.scheduledFromPreviousDays || 0} from yesterday`,
    },
    {
      title: "Published Today",
      value: stats?.posts?.publishToday || 0,
      icon: CheckCircle,
      change: `+${stats?.posts?.publishedFromPreviousDays || 0} from yesterday`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-5 grid-cols-2">
      {contentStats.map((stat) => (
        <Card className="py-3" key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
