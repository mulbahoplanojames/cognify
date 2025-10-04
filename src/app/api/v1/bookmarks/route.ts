import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const toggleBookmarkSchema = z.object({
  postId: z.string().min(5),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (postId) {
      // Check if a specific post is bookmarked
      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
      });

      return NextResponse.json({ bookmarked: !!bookmark });
    }

    // If no postId provided, return all bookmarks
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        post: {
          select: { id: true, slug: true, title: true, excerpt: true },
        },
      },
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error in bookmarks GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { postId } = toggleBookmarkSchema.parse(body);

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (post) {
      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_postId: {
            postId: postId,
            userId: session.user.id,
          },
        },
      });

      if (bookmark) {
        await prisma.bookmark.delete({
          where: { id: bookmark.id },
        });
        return NextResponse.json({ bookmarked: false });
      } else {
        await prisma.bookmark.create({
          data: { userId: session.user.id, postId: postId },
        });
        return NextResponse.json({ bookmarked: true });
      }
    } else {
      return NextResponse.json({ message: "No Post Not Found" });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "An error occurred" });
  }
}
