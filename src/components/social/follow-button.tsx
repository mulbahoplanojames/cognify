"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface FollowButtonProps {
  userId: string;
  username: string;
}

export function FollowButton({ userId, username }: FollowButtonProps) {
  const session = useSession();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session && session.data?.user.id !== userId) {
      checkFollowStatus();
    }
  }, [userId, session]);

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(`/api/v1/follow/check?userId=${userId}`);
      if (response.ok) {
        const { following } = await response.json();
        setIsFollowing(following);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Failed to check follow status", {
        description: errorMessage || "Failed to check follow status",
      });
    }
  };

  const handleToggleFollow = async () => {
    if (!session.data?.session) {
      toast.error("Sign in required", {
        description: "Please sign in to follow users",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followingId: userId }),
      });

      if (response.ok) {
        const { following } = await response.json();
        setIsFollowing(following);
        toast.success(
          following ? `Following ${username}!` : `Unfollowed ${username}`
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Failed to update follow status", {
        description: errorMessage || "Failed to update follow status",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show follow button for own profile
  if (!session || session.data?.user.id === userId) {
    return null;
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      onClick={handleToggleFollow}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isFollowing ? (
        <UserMinus className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {isLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}

//todo: get followers
// const followers = await prisma.follow.findMany({
//   where: {
//     followingId: user.id,
//   },
//   include: {
//     follower: {
//       select: { id: true, name: true, image: true },
//     },
//   },
// });
