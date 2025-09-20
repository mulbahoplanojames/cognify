"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface BookmarkButtonProps {
  postId: string;
}

export function BookmarkButton({ postId }: BookmarkButtonProps) {
  const session = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      checkBookmarkStatus();
    }
  }, [postId, session]);

  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch(`/api/bookmarks/check?postId=${postId}`);
      if (response.ok) {
        const { bookmarked } = await response.json();
        setIsBookmarked(bookmarked);
      }
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  const handleToggleBookmark = async () => {
    if (!session) {
      toast.error("Sign in required", {
        description: "Please sign in to bookmark posts",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        const { bookmarked } = await response.json();
        setIsBookmarked(bookmarked);
        toast.success(` ${bookmarked} ? "Bookmarked!" : "Bookmark removed"`, {
          description: bookmarked
            ? "Post saved to your bookmarks"
            : "Post removed from bookmarks",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update bookmark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={isBookmarked ? "text-blue-500" : ""}
    >
      <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
      {isBookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}
