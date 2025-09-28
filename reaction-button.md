```js
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Zap, Lightbulb } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { ReactionType } from "../../../generated/prisma";

interface ReactionButtonsProps {
  targetId: string;
  targetType: "post" | "comment";
}

const reactionConfig = {
  LIKE: { icon: Heart, label: "Like", color: "text-red-500" },
  CLAP: { icon: Zap, label: "Clap", color: "text-yellow-500" },
  INSIGHTFUL: { icon: Lightbulb, label: "Insightful", color: "text-blue-500" },
};

export function ReactionButtons({
  targetId,
  targetType,
}: ReactionButtonsProps) {
  const session = useSession();
  const [reactions, setReactions] = useState<Record<ReactionType, number>>({
    LIKE: 0,
    CLAP: 0,
    INSIGHTFUL: 0,
  });
  const [userReactions, setUserReactions] = useState<ReactionType[]>([]);

  useEffect(() => {
    if (session.data?.session) {
      fetchReactions();
    }
  }, [targetId, session]);

  const fetchReactions = async () => {
    try {
      const params = new URLSearchParams({
        [targetType === "post" ? "postId" : "commentId"]: targetId,
      });

      const [statsResponse, userResponse] = await Promise.all([
        fetch(`/api/reactions/stats?${params}`),
        fetch(`/api/reactions/user?${params}`),
      ]);

      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setReactions(stats);
      }

      if (userResponse.ok) {
        const userReactionData = await userResponse.json();
        setUserReactions(userReactionData);
      }
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  };

  const handleReaction = async (type: ReactionType) => {
    if (!session.data?.session) {
      toast.error("Sign in required", {
        description: "Please sign in to react to posts",
      });
      return;
    }

    try {
      const response = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          [targetType === "post" ? "postId" : "commentId"]: targetId,
        }),
      });

      if (response.ok) {
        const { added, count } = await response.json();

        setReactions((prev) => ({ ...prev, [type]: count }));

        if (added) {
          setUserReactions((prev) => [...prev, type]);
        } else {
          setUserReactions((prev) => prev.filter((r) => r !== type));
        }
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update reaction",
      });
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

```
