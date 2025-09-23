import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    // First, check if the category has any posts
    const categoryWithPosts = await prisma.category.findUnique({
      where: { id },
      include: {
        posts: {
          take: 1, // We only need to know if there's at least one post
        },
      },
    });

    if (!categoryWithPosts) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    if (categoryWithPosts.posts.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category that is in use by one or more posts" },
        { status: 400 }
      );
    }

    // If no posts, safe to delete
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
