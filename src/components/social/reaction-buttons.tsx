"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Zap, Lightbulb } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { ReactionType } from "../../../generated/prisma";

type ReactionTarget = {
  // For posts
  slug?: string;
  // For comments
  targetId?: string;
  targetType?: "post" | "comment";
};

type ReactionButtonsProps =
  | { slug: string; targetId?: never; targetType?: never }
  | { slug?: never; targetId: string; targetType: "post" | "comment" };

const reactionConfig = {
  LIKE: { icon: Heart, label: "Like", color: "text-red-500" },
  CLAP: { icon: Zap, label: "Clap", color: "text-yellow-500" },
  INSIGHTFUL: { icon: Lightbulb, label: "Insightful", color: "text-blue-500" },
};

export function ReactionButtons({
  slug,
  targetId,
  targetType,
}: ReactionButtonsProps) {
  // Determine the ID to use based on props
  const postId = slug || (targetType === "post" ? targetId : undefined);
  const commentId = targetType === "comment" ? targetId : undefined;

  // Debug the props
  console.log("ReactionButtons received props:", {
    slug,
    targetId,
    targetType,
    postId,
    commentId,
  });

  const session = useSession();
  const [reactions, setReactions] = useState<Record<ReactionType, number>>({
    LIKE: 0,
    CLAP: 0,
    INSIGHTFUL: 0,
  });
  const [userReactions, setUserReactions] = useState<ReactionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch reactions when the component mounts or when the session changes
  useEffect(() => {
    const fetchUserReactions = async () => {
      if (!session.data?.session) {
        setUserReactions([]);
        return;
      }

      try {
        // Fetch the user's reactions for this post/comment
        const params = new URLSearchParams();
        if (postId) params.set("postId", postId);
        if (commentId) params.set("commentId", commentId);

        const response = await fetch(`/api/v1/reactions?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch reactions");

        const { reactions: userReactions } = await response.json();
        setUserReactions(userReactions);

        // Also fetch the total reaction counts
        await fetchReactionCounts();
      } catch (error) {
        console.error("Error fetching user reactions:", error);
        toast.error("Failed to load reactions");
      }
    };

    fetchUserReactions();
  }, [session, postId, commentId]);

  const fetchReactionCounts = async () => {
    try {
      const params = new URLSearchParams();
      if (postId) params.set("postId", postId);
      if (commentId) params.set("commentId", commentId);

      // Fetch all reactions for this post/comment
      const response = await fetch(`/api/v1/reactions?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch reaction counts");

      const { reactions: allReactions } = await response.json();

      // Count reactions by type
      const counts = allReactions.reduce(
        (acc: Record<string, number>, type: string) => {
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      setReactions({
        LIKE: counts.LIKE || 0,
        CLAP: counts.CLAP || 0,
        INSIGHTFUL: counts.INSIGHTFUL || 0,
      });
    } catch (error) {
      console.error("Error fetching reaction counts:", error);
      toast.error("Failed to load reaction counts");
    }
  };

  const handleReaction = async (type: ReactionType) => {
    if (!session.data?.session) {
      toast.error("Sign in required", {
        description: "Please sign in to react",
      });
      return;
    }

    if (!postId && !commentId) {
      console.error(
        "Error: Either postId or commentId is required but was not provided"
      );
      toast.error("Error", {
        description:
          "Missing required ID. Please refresh the page and try again.",
      });
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const isActive = userReactions.includes(type);
      const endpoint = `/api/v1/reactions`;
      const requestBody = {
        type,
        ...(postId && { postId }),
        ...(commentId && { commentId }),
      };

      console.log("Sending request to:", endpoint);
      console.log("Request body:", requestBody);

      // Validate the request body before sending
      if (!requestBody.postId && !requestBody.commentId) {
        throw new Error("Either postId or commentId is required");
      }

      const response = await fetch(endpoint, {
        method: isActive ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any required authentication headers if needed
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json().catch(() => ({}));
      console.log("Response status:", response.status);
      console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update reaction");
      }

      // Update local state optimistically
      setReactions((prev) => ({
        ...prev,
        [type]: isActive ? Math.max(0, prev[type] - 1) : (prev[type] || 0) + 1,
      }));

      setUserReactions((prev) =>
        isActive ? prev.filter((r) => r !== type) : [...prev, type]
      );
    } catch (error) {
      console.error("Error updating reaction:", error);
      toast.error("Error", {
        description: "Failed to update reaction. Please try again.",
      });
      // Re-fetch to sync with server
      if (postId || commentId) {
        fetchReactionCounts();
        const params = new URLSearchParams();
        if (postId) params.set("postId", postId);
        if (commentId) params.set("commentId", commentId);

        try {
          const response = await fetch(
            `/api/v1/reactions/user?${params.toString()}`
          );
          if (response.ok) {
            const { reactions: userReactions } = await response.json();
            setUserReactions(userReactions);
          }
        } catch (error) {
          console.error("Error refetching user reactions:", error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {Object.entries(reactionConfig).map(([type, config]) => {
        const reactionType = type as ReactionType;
        const Icon = config.icon;
        const isActive = userReactions.includes(reactionType);
        const count = reactions[reactionType];

        return (
          <Button
            key={type}
            variant="ghost"
            size="sm"
            onClick={() => handleReaction(reactionType)}
            className={`flex items-center gap-1 ${
              isActive ? config.color : ""
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "fill-current" : ""}`} />
            {count > 0 && <span className="text-xs">{count}</span>}
          </Button>
        );
      })}
    </div>
  );
}
