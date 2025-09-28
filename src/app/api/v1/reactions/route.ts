import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { ReactionType } from "../../../../../generated/prisma";

const toggleReactionSchema = z.object({
  type: z.enum(["LIKE", "CLAP", "INSIGHTFUL"]),
  postId: z.string().optional(),
  commentId: z.string().optional(),
});

async function handleRequest(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Request body:", body);

    const data = toggleReactionSchema.parse(body);
    console.log("Parsed data:", data);

    if (!data.postId && !data.commentId) {
      console.error(
        "Validation failed: Either postId or commentId is required",
      );
      return NextResponse.json(
        { error: "Either postId or commentId is required" },
        { status: 400 },
      );
    }

    const existingReaction = await prisma.reaction.findFirst({
      where: {
        userId: session.user.id,
        type: data.type,
        ...(data.postId && { postId: data.postId }),
        ...(data.commentId && { commentId: data.commentId }),
      },
    });

    if (existingReaction) {
      // Remove reaction
      await prisma.reaction.delete({
        where: { id: existingReaction.id },
      });

      const count = await getReactionCount(
        data.type,
        data.postId,
        data.commentId,
      );
      return NextResponse.json({ added: false, count });
    } else {
      // Add reaction
      const result = await prisma.reaction.create({
        data: {
          userId: session.user.id,
          type: data.type,
          ...(data.postId && { postId: data.postId }),
          ...(data.commentId && { commentId: data.commentId }),
        },
      });

      const count = await getReactionCount(
        data.type,
        data.postId,
        data.commentId,
      );
      return NextResponse.json({ added: true, count });
    }
  } catch (error) {
    console.error("Error toggling reaction:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to toggle reaction" },
      { status: 500 },
    );
  }
}

// Handle POST requests
export async function POST(request: NextRequest) {
  return handleRequest(request);
}

// Handle DELETE requests
export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

// Handle GET requests to fetch user reactions
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId") || undefined;
    const commentId = searchParams.get("commentId") || undefined;

    if (!postId && !commentId) {
      return NextResponse.json(
        { error: "Either postId or commentId is required" },
        { status: 400 },
      );
    }

    // Get the user's reactions for this post/comment
    const userReactions = await prisma.reaction.findMany({
      where: {
        userId: session.user.id,
        ...(postId && { postId }),
        ...(commentId && { commentId }),
      },
      select: {
        type: true,
      },
    });

    // Extract just the reaction types
    const reactionTypes = userReactions.map((r) => r.type);

    return NextResponse.json({
      reactions: reactionTypes,
    });
  } catch (error) {
    console.error("Error fetching user reactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch user reactions" },
      { status: 500 },
    );
  }
}

const getReactionCount = async (
  type: ReactionType,
  postId?: string,
  commentId?: string,
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
