import { type NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { PostStatus } from "../../../../../generated/prisma";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().optional(),
  ogImage: z.string().optional(),
  readingTime: z.number().optional(),
  publishedAt: z.string().datetime().nullish(),
  scheduledAt: z.string().datetime().nullish(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  status: z.nativeEnum(PostStatus).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    //Todo: Get post by slug
    const post = await prisma.post.findUnique({
      where: {
        slug: slug,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        tags: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: {
            comments: true,
            reactions: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    //todo: Increment view count for published posts
    if (post.status === "PUBLISHED") {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          views: { increment: 1 },
        },
      });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //Todo: Get post by slug
    const post = await prisma.post.findUnique({
      where: {
        slug: slug,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        tags: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: {
            comments: true,
            reactions: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    //todo: Check if user owns the post or is admin
    const isAdmin = session.user.role === "ADMIN";
    const isAuthor = post.authorId === session.user.id;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = updatePostSchema.parse(body);

    //todo: Only admins can publish posts
    if (data.status === PostStatus.PUBLISHED && !isAdmin) {
      return NextResponse.json(
        { error: "Only admins can publish posts" },
        { status: 403 }
      );
    }

    //todo: If status is being updated to PUBLISHED, set publishedAt
    // Create updateData with all fields from data except id
    const { id: _, ...updateData } = data as any;

    if (
      updateData.status === PostStatus.PUBLISHED &&
      post.status !== PostStatus.PUBLISHED
    ) {
      updateData.publishedAt = new Date().toISOString();
    }

    // Get current post to check status transitions
    const currentPost = await prisma.post.findUnique({
      where: { id: post.id },
      select: { status: true, publishedAt: true },
    });

    if (!currentPost) {
      throw new Error("Post not found");
    }

    //todo: Handle status transitions
    if (data.status && data.status !== currentPost.status) {
      // If changing to PUBLISHED, set publishedAt
      if (data.status === "PUBLISHED") {
        updateData.publishedAt = new Date();
      }
      // If changing from PUBLISHED to something else, clear publishedAt
      else if (currentPost.status === "PUBLISHED") {
        updateData.publishedAt = null;
      }
    }

    // id is already excluded from updateData, no need to delete it

    // Handle tag updates if tagIds are provided
    const tagUpdate = data.tagIds
      ? {
          tags: {
            set: data.tagIds.map((id) => ({ id })),
          },
        }
      : {};

    // Update the post with proper includes
    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: {
        ...updateData,
        ...tagUpdate,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        category: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            reactions: true,
            bookmarks: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        tags: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: {
            comments: true,
            reactions: true,
            bookmarks: true,
          },
        },
      },
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user owns the post or is admin
    if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id: post.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
