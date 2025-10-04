import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReactionType } from "@/types/prisma-types";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const toggleReactionSchema = z.object({
  type: z.enum(["LIKE", "CLAP", "INSIGHTFUL"]),
  postId: z.string().optional(),
  commentId: z.string().optional(),
});

const getUserReactionsSchema = z.object({
  postId: z.string().optional(),
  commentId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = toggleReactionSchema.parse(body);

    if (!data.postId && !data.commentId) {
      return NextResponse.json(
        { error: "Either postId or commentId is required" },
        { status: 400 }
      );
    }

    const { type, postId, commentId } = data;

    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        userId: session.user.id,
        type,
        ...(postId && { postId }),
        ...(commentId && { commentId }),
      },
    });

    if (existingReaction) {
      // Remove reaction
      await prisma.reaction.delete({
        where: { id: existingReaction.id },
      });

      const count = await getReactionCount(
        type as ReactionType,
        postId,
        commentId
      );
      return NextResponse.json({ added: false, count });
    } else {
      // Add reaction
      await prisma.reaction.create({
        data: {
          userId: session.user.id,
          type,
          ...(postId && { postId }),
          ...(commentId && { commentId }),
        },
      });

      const count = await getReactionCount(
        type as ReactionType,
        postId,
        commentId
      );
      return NextResponse.json({ added: true, count });
    }
  } catch (error) {
    console.error("Error toggling reaction:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to toggle reaction" },
      { status: 500 }
    );
  }
}

const getReactionCount = async (
  type: ReactionType,
  postId?: string,
  commentId?: string
) => {
  const count = await prisma.reaction.count({
    where: {
      type,
      ...(postId && { postId }),
      ...(commentId && { commentId }),
    },
  });
  return count;
};

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = {
      postId: searchParams.get("postId") || undefined,
      commentId: searchParams.get("commentId") || undefined,
    };

    // Validate query parameters
    const data = getUserReactionsSchema.parse(queryParams);

    // If both postId and commentId are provided, it's invalid
    if (data.postId && data.commentId) {
      return NextResponse.json(
        { error: "Only one of postId or commentId can be provided" },
        { status: 400 }
      );
    }

    const reactions = await prisma.reaction.findMany({
      where: {
        userId: session.user.id,
        ...(data.postId && { postId: data.postId }),
        ...(data.commentId && { commentId: data.commentId }),
      },
      select: { type: true },
    });

    return NextResponse.json({ reactions });
  } catch (error) {
    console.error("Error fetching user reactions:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch user reactions" },
      { status: 500 }
    );
  }
}
