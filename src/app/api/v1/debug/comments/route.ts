import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all comments with their post and author information
    const comments = await prisma.comment.findMany({
      take: 10, // Limit to 10 comments for debugging
      include: {
        post: {
          select: { id: true, title: true, slug: true },
        },
        author: {
          select: { id: true, name: true, email: true },
        },
        replies: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get counts
    const totalComments = await prisma.comment.count();
    const visibleComments = await prisma.comment.count({
      where: { status: 'VISIBLE' },
    });
    const postsWithComments = await prisma.post.findMany({
      where: {
        comments: {
          some: {},
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        _count: {
          select: { comments: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      counts: {
        total: totalComments,
        visible: visibleComments,
        postsWithComments: postsWithComments.length,
      },
      recentComments: comments,
      postsWithComments,
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
