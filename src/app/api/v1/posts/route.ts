import { type NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PostStatus } from "../../../../../generated/prisma";

const createPostSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().min(1).max(300),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  coverImage: z.string().optional(), // Removed .url() validation to allow placeholder URLs
  ogImage: z.string().optional(),
  status: z.nativeEnum(PostStatus).optional().default(PostStatus.DRAFT),
  publishedAt: z.string().datetime().nullish(),
  scheduledAt: z.string().datetime().nullish(),
  readingTime: z.number().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Number.parseInt(searchParams.get("limit") || "10");
  const offset = Number.parseInt(searchParams.get("offset") || "0");

  try {
    const posts = await prisma.post.findMany({
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
      take: limit,
      skip: offset,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    //Todo: Get the session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //todo: Check if user has permission to create posts
    if (session.user.role !== "AUTHOR" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error:
            "Insufficient permissions. Only authors and admins can create posts.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = createPostSchema.parse(body);

    //todo: Determine the status based on user role and input
    let status = data.status || PostStatus.DRAFT;

    //todo: Only admins can publish directly
    if (status === PostStatus.PUBLISHED && session.user.role !== "ADMIN") {
      status = PostStatus.DRAFT;
    }

    //todo: If scheduled but no scheduledAt date, default to DRAFT
    if (status === PostStatus.SCHEDULED && !data.scheduledAt) {
      status = PostStatus.DRAFT;
    }

    //todo: Create post with the determined status
    const post = await prisma.post.create({
      data: {
        ...data,
        authorId: session.user.id,
        status,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        // ...(data.tagIds &&
        //   data.tagIds.length > 0 && {
        //     tags: {
        //       connect: data.tagIds.map((id) => ({ id })),
        //     },
        //   }),
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

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
