import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First, check if the tag has any posts
    const tagWithPosts = await prisma.tag.findUnique({
      where: { id },
      include: {
        posts: {
          take: 1, // We only need to know if there's at least one post
        },
      },
    });

    if (!tagWithPosts) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    if (tagWithPosts.posts.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete tag that is in use by one or more posts" },
        { status: 400 }
      );
    }

    // If no posts, safe to delete
    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Tag deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
