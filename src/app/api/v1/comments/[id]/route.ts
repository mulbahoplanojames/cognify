import { type NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { CommentStatus } from "../../../../../../generated/prisma";

const updateCommentSchema = z.object({
  body: z.string().min(1).max(1000),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: postId } = params;

  try {
    // First, get all comments for this post
    const allComments = await prisma.comment.findMany({
      where: {
        postId,
        status: CommentStatus.VISIBLE,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { reactions: true, replies: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Separate top-level comments from replies
    const topLevelComments = allComments.filter((comment) => !comment.parentId);
    const replies = allComments.filter((comment) => comment.parentId);

    // Add replies to their parent comments
    const commentsWithReplies = topLevelComments.map((comment) => ({
      ...comment,
      replies: replies
        .filter((reply) => reply.parentId === comment.id)
        .map(({ _count, ...reply }) => ({
          ...reply,
          _count: {
            reactions: _count?.reactions || 0,
            replies: _count?.replies || 0,
          },
        })),
    }));

    return NextResponse.json(commentsWithReplies);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Todo: Get a comment query
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { reactions: true, replies: true },
        },
      },
    });
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { body: commentBody } = updateCommentSchema.parse(body);

    // Todo: Update comment query
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        body: commentBody,
        editedAt: new Date(),
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Todo: Update comment query
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { reactions: true, replies: true },
        },
      },
    });
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Todo: Update comment query
    await prisma.comment.update({
      where: { id },
      data: {
        status: CommentStatus.DELETED,
        body: "[deleted]",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
