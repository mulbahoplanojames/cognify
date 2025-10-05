import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all comments with their structure
    const allComments = await prisma.comment.findMany({
      select: {
        id: true,
        body: true,
        parentId: true,
        postId: true,
        status: true,
        author: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by postId for better readability
    const commentsByPost = allComments.reduce((acc, comment) => {
      if (!acc[comment.postId]) {
        acc[comment.postId] = [];
      }
      acc[comment.postId].push({
        id: comment.id,
        body:
          comment.body.substring(0, 50) +
          (comment.body.length > 50 ? "..." : ""),
        parentId: comment.parentId,
        status: comment.status,
        author: comment.author.name,
      });
      return acc;
    }, {} as Record<string, unknown[]>);

    return NextResponse.json({
      success: true,
      totalComments: allComments.length,
      commentsByPost,
      rawComments: allComments,
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments structure" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
