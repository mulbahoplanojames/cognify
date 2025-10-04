```js
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Zap, Lightbulb } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { ReactionType } from "@/types/prisma-types";

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

```js
// import { auth } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { headers } from "next/headers";
// import { type NextRequest, NextResponse } from "next/server";
// import { z, ZodError } from "zod";
// import { ReactionType } from "../../../../../generated/prisma";

// const toggleReactionSchema = z.object({
//   type: z.enum(["LIKE", "CLAP", "INSIGHTFUL"]),
//   postId: z.string().optional(),
//   commentId: z.string().optional(),
// });

// async function handleRequest(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });
//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await request.json();
//     console.log("Request body:", body);

//     const data = toggleReactionSchema.parse(body);
//     console.log("Parsed data:", data);

//     if (!data.postId && !data.commentId) {
//       console.error(
//         "Validation failed: Either postId or commentId is required",
//       );
//       return NextResponse.json(
//         { error: "Either postId or commentId is required" },
//         { status: 400 },
//       );
//     }

//     const existingReaction = await prisma.reaction.findFirst({
//       where: {
//         userId: session.user.id,
//         type: data.type,
//         ...(data.postId && { postId: data.postId }),
//         ...(data.commentId && { commentId: data.commentId }),
//       },
//     });

//     if (existingReaction) {
//       // Remove reaction
//       await prisma.reaction.delete({
//         where: { id: existingReaction.id },
//       });

//       const count = await getReactionCount(
//         data.type,
//         data.postId,
//         data.commentId,
//       );
//       return NextResponse.json({ added: false, count });
//     } else {
//       // Add reaction
//       const result = await prisma.reaction.create({
//         data: {
//           userId: session.user.id,
//           type: data.type,
//           ...(data.postId && { postId: data.postId }),
//           ...(data.commentId && { commentId: data.commentId }),
//         },
//       });

//       const count = await getReactionCount(
//         data.type,
//         data.postId,
//         data.commentId,
//       );
//       return NextResponse.json({ added: true, count });
//     }
//   } catch (error) {
//     console.error("Error toggling reaction:", error);
//     if (error instanceof ZodError) {
//       return NextResponse.json(
//         { error: "Invalid data", details: error.issues },
//         { status: 400 },
//       );
//     }
//     return NextResponse.json(
//       { error: "Failed to toggle reaction" },
//       { status: 500 },
//     );
//   }
// }

// // Handle POST requests
// export async function POST(request: NextRequest) {
//   return handleRequest(request);
// }

// // Handle DELETE requests
// export async function DELETE(request: NextRequest) {
//   return handleRequest(request);
// }

// // Handle GET requests to fetch user reactions
// export async function GET(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });

//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { searchParams } = new URL(request.url);
//     const postId = searchParams.get("postId") || undefined;
//     const commentId = searchParams.get("commentId") || undefined;

//     if (!postId && !commentId) {
//       return NextResponse.json(
//         { error: "Either postId or commentId is required" },
//         { status: 400 },
//       );
//     }

//     // Get the user's reactions for this post/comment
//     const userReactions = await prisma.reaction.findMany({
//       where: {
//         userId: session.user.id,
//         ...(postId && { postId }),
//         ...(commentId && { commentId }),
//       },
//       select: {
//         type: true,
//       },
//     });

//     // Extract just the reaction types
//     const reactionTypes = userReactions.map((r) => r.type);

//     return NextResponse.json({
//       reactions: reactionTypes,
//     });
//   } catch (error) {
//     console.error("Error fetching user reactions:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch user reactions" },
//       { status: 500 },
//     );
//   }
// }

// const getReactionCount = async (
//   type: ReactionType,
//   postId?: string,
//   commentId?: string,
// ) => {
//   const count = await prisma.reaction.count({
//     where: {
//       type,
//       ...(postId && { postId }),
//       ...(commentId && { commentId }),
//     },
//   });
//   return count;
// };
```
