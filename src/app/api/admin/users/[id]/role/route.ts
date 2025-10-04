import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/types/prisma-types";

const updateRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { role } = updateRoleSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { role },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user role:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.format() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
