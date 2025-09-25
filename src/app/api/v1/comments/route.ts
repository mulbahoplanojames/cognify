import { type NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { CommentStatus } from "../../../../../generated/prisma";

const createCommentSchema = z.object({
  body: z.string().min(1).max(1000),
  postId: z.string(),
  parentId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = createCommentSchema.parse(body);

    // const comment = await CommentService.createComment(session.user.id, data);
    const comment = prisma.comment.create({
      data: {
        ...data,
        authorId: session.user.id,
        status: CommentStatus.VISIBLE,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
