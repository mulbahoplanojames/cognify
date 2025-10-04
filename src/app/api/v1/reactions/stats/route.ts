import { prisma } from "@/lib/prisma";
import { ReactionType } from "@/types/prisma-types";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const queryParamsSchema = z.object({
  postId: z.string().optional(),
  commentId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      postId: searchParams.get("postId") || undefined,
      commentId: searchParams.get("commentId") || undefined,
    };

    const data = queryParamsSchema.parse(queryParams);

    if (data.postId && data.commentId) {
      return NextResponse.json(
        { error: "Only one of postId or commentId can be provided" },
        { status: 400 }
      );
    }

    const stats = await getReactionStats(data.postId, data.commentId);

    const defaultStats: Record<string, number> = {
      LIKE: 0,
      CLAP: 0,
      INSIGHTFUL: 0,
    };

    return NextResponse.json({ ...defaultStats, ...stats });
  } catch (error) {
    console.error("Error fetching reaction stats:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch reaction stats" },
      { status: 500 }
    );
  }
}

const getReactionStats = async (postId?: string, commentId?: string) => {
  const reactions = await prisma.reaction.groupBy({
    by: ["type"],
    where: {
      ...(postId && { postId }),
      ...(commentId && { commentId }),
    },
    _count: {
      type: true,
    },
  });

  return reactions.reduce((acc, reaction) => {
    acc[reaction.type] = reaction._count.type;
    return acc;
  }, {} as Record<ReactionType, number>);
};
