import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;
  try {
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const commentId = searchParams.get("commentId");

    if (!postId && !commentId) {
      return NextResponse.json(
        { error: "Either postId or commentId is required" },
        { status: 400 }
      );
    }

    const whereClause: { userId: string; postId?: string; commentId?: string } =
      { userId };

    if (postId) {
      whereClause.postId = postId;
    } else if (commentId) {
      whereClause.commentId = commentId;
    }

    const reactions = await prisma.reaction.findMany({
      where: whereClause,
      select: {
        type: true,
      },
    });

    return NextResponse.json({
      reactions: reactions.map((r) => r.type),
    });
  } catch (error) {
    console.error("Error fetching user reactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch user reactions" },
      { status: 500 }
    );
  }
}
