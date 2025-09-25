import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z, ZodError } from "zod";
import { ReactionType } from "../../../../../../../generated/prisma";

const createReactionSchema = z.object({
  type: z.nativeEnum(ReactionType),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
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
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await request.json();

    const { type } = createReactionSchema.parse(body);

    const reaction = await prisma.reaction.create({
      data: {
        type: type,
        userId: session.user.id,
        postId: post.id,
      },
      include: {
        user: true,
        post: true,
      },
    });

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;

    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await request.json();
    const { type } = createReactionSchema.parse(body);

    // Delete the reaction if it exists
    await prisma.reaction.deleteMany({
      where: {
        userId: session.user.id,
        postId: post.id,
        type,
      },
    });

    return NextResponse.json({ message: "Reaction removed." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to remove reaction." },
      { status: 500 },
    );
  }
}
