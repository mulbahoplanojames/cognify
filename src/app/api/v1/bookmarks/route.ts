import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const toggleBookmarkSchema = z.object({
  postId: z.string().min(5),
});

// Tasked that is left
// This endpoint should return an array of bookmarks
// That includes data in this format
// [
//    {
//      id: 1234,
//      userId: 1,
//      postId: 42,
//      post: {
//        title: 'Tupac Skakur rise to Popularity',
//        slug: 'tupac-shakur-rise-to-popularity',
//        description: 'In this post I'm going to uncover how ....'
//     }
// }
// ]
//

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    return NextResponse.json({ message: "Hello World" });
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

    return NextResponse.json({ message: "Hello World" }); // I think you can remove this afterwards
    //
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "An error occurred" });
  }
}
