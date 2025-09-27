import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "../../../../../../generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* 
      This code extracts query parameters from the URL of the API request.
      It gets the limit, offset, role, and search parameters and converts them to the appropriate types.
     */
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const offset = Number.parseInt(searchParams.get("offset") || "0");
    const role = searchParams.get("role") as UserRole | null;
    const search = searchParams.get("search");

    /* 
      This code fetches users from the database based on the query parameters.
      It uses the Prisma client to query the database for users with the specified role and search parameters.
      The take and skip parameters are used to implement pagination.
     */
    const users = await prisma.user.findMany({
      where: {
        role: role || undefined,
        name: {
          contains: search || undefined,
        },
      },
      take: limit,
      skip: offset,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
