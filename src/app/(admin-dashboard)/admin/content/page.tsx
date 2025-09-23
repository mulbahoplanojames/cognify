"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, XCircle, Clock, Loader2 } from "lucide-react";
import { Post } from "@/lib/prisma";
import ContentPostCard from "@/components/admin/content/content-post-card";
import { toast } from "sonner";
import ContentStatsCards from "@/components/admin/content/content-stats-cards";

const mapApiPostToUiPost = (post: any): Post => ({
  ...post,
  status:
    post.status === "PENDING"
      ? "PENDING"
      : post.status === "PUBLISHED"
      ? "PUBLISHED"
      : post.status === "SCHEDULED"
      ? "SCHEDULED"
      : "DRAFT",
  author: {
    name: post.author?.name || "Unknown",
    username: post.author?.username || "unknown",
  },
});

export default function ContentModerationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all posts with their authors
        const response = await fetch("/api/v1/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        console.log("Post for moderaate", data);
        const mappedPosts = data.map(mapApiPostToUiPost);
        console.log("Mapped posts", mappedPosts);
        setPosts(mappedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
        toast.error("Error", {
          description: "Failed to load posts",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  const handleStatusUpdate = async (postId: string, newStatus: string) => {
    try {
      // Find the post in the local state to get the slug
      const post = posts.find((p) => p.id === postId);

      if (!post) {
        throw new Error("Post not found in local state");
      }

      const response = await fetch(`/api/v1/posts/${post.slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post status");
      }

      // Update local state
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, status: newStatus as any } : p
        )
      );

      toast.success("Status updated", {
        description: `Post has been ${
          newStatus === "PUBLISHED" ? "published" : "rejected"
        }.`,
      });
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to update post status. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Error loading posts
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:text-red-200 dark:bg-red-900/50 dark:hover:bg-red-800/50"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorId.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending")
      return matchesSearch && post.status === "PENDING";
    if (activeTab === "scheduled")
      return matchesSearch && post.status === "SCHEDULED";
    if (activeTab === "published")
      return matchesSearch && post.status === "PUBLISHED";
    if (activeTab === "drafts") return matchesSearch && post.status === "DRAFT";

    return matchesSearch;
  });

  return (
    <div className="space-y-6 ">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Content Moderation
        </h1>
        <p className="text-muted-foreground">
          Review and manage published content
        </p>
      </div>

      {/* Stats Cards */}
      <ContentStatsCards />

      {/* Search and Filters */}
      <div className="flex items-center space-x-2 ">
        <div className="relative flex-1 min-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search posts or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No posts found</h3>
                <p className="text-muted-foreground">
                  All posts will appear here.
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <ContentPostCard
                  key={post.id}
                  post={post}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="published" className="space-y-4">
          <div className="grid gap-4">
            {filteredPosts.filter((post) => post.status === "PUBLISHED")
              .length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No published posts</h3>
                <p className="text-muted-foreground">
                  Published posts will appear here.
                </p>
              </div>
            ) : (
              filteredPosts
                .filter((post) => post.status === "PUBLISHED")
                .map((post) => (
                  <ContentPostCard
                    key={post.id}
                    post={post}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {filteredPosts.filter((post) => post.status === "PENDING")
              .length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No pending posts</h3>
                <p className="text-muted-foreground">
                  Posts awaiting review will appear here.
                </p>
              </div>
            ) : (
              filteredPosts
                .filter((post) => post.status === "PENDING")
                .map((post) => (
                  <ContentPostCard
                    key={post.id}
                    post={post}
                    onStatusUpdate={handleStatusUpdate}
                    showApproveReject={true}
                  />
                ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid gap-4">
            {filteredPosts.filter((post) => post.status === "SCHEDULED")
              .length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No scheduled posts</h3>
                <p className="text-muted-foreground">
                  Scheduled posts will appear here.
                </p>
              </div>
            ) : (
              filteredPosts
                .filter((post) => post.status === "SCHEDULED")
                .map((post) => (
                  <ContentPostCard
                    key={post.id}
                    post={post}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="drafts" className="space-y-4">
          <div className="grid gap-4">
            {filteredPosts.filter((post) => post.status === "DRAFT").length ===
            0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No draft posts</h3>
                <p className="text-muted-foreground">
                  Draft posts will appear here.
                </p>
              </div>
            ) : (
              filteredPosts
                .filter((post) => post.status === "DRAFT")
                .map((post) => (
                  <ContentPostCard
                    key={post.id}
                    post={post}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
