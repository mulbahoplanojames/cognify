import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const featureRequestSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(2000),
  type: z.enum(["feature", "feedback", "bug"]),
  email: z.string().email().optional().or(z.literal("")),
});

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be signed in to submit a feature request" },
        { status: 401 }
      );
    }

    const json = await request.json();
    const body = featureRequestSchema.safeParse(json);

    if (!body.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: body.error.format() },
        { status: 400 }
      );
    }

    const { title, description, type, email } = body.data;

    // Get the user ID if the user is logged in
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    const featureRequest = await prisma.featureRequest.create({
      data: {
        title,
        description,
        type,
        email: email || session.user.email || undefined,
      },
    });

    return NextResponse.json(featureRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating feature request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Only admins can list all feature requests
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const featureRequests = await prisma.featureRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(featureRequests);
  } catch (error) {
    console.error("Error fetching feature requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
