import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const toggleFollowSchema = z.object({
  followingId: z.string(),
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
    const { followingId } = toggleFollowSchema.parse(body);

    if (session.user.id === followingId) {
      throw new Error("Cannot follow yourself");
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });
      return NextResponse.json({ following: false });
    } else {
      await prisma.follow.create({
        data: { followerId: session.user.id, followingId },
      });
      return NextResponse.json({ following: true });
    }
  } catch (error: any) {
    console.error("Error toggling follow:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to toggle follow" },
      { status: 500 }
    );
  }
}
