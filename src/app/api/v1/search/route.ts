import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ErrorWithInfo = Error & {
  code?: string | number;
  meta?: any;
};

// Define types for the response
interface SearchResult {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  publishedAt: string | null;
  readingTime: number | null;
  author: {
    id: string;
    name: string;
    image: string | null;
  } | null;
  coverImage: string | null;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

interface SearchParams {
  q?: string;
  page?: string;
  limit?: string;
  categories?: string;
  tags?: string;
  sort?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params: SearchParams = Object.fromEntries(searchParams.entries());

    // Parse and validate parameters
    const query = params.q?.trim() || "";
    const page = Math.max(1, parseInt(params.page || "") || DEFAULT_PAGE);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(params.limit || "") || DEFAULT_LIMIT)
    );
    const skip = (page - 1) * limit;

    // Parse categories and tags from comma-separated strings
    const categoryIds = params.categories?.split(",").filter(Boolean) || [];
    const tagIds = params.tags?.split(",").filter(Boolean) || [];

    // Build the base where clause
    const where: any = {
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
    };

    // Add search query conditions if provided
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { excerpt: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ];
    }

    //todo: Add category filter if categories are provided
    if (categoryIds.length > 0) {
      where.category = {
        id: { in: categoryIds },
      };
    }

    //todo: Add tag filter if tags are provided
    if (tagIds.length > 0) {
      try {
        console.log("Filtering by tag IDs:", tagIds);
        where.AND = where.AND || [];
        where.AND.push({
          // This ensures all specified tags must be present in the post's tagIds array
          AND: tagIds.map((tagId) => ({
            tagIds: {
              has: tagId,
            },
          })),
        });
      } catch (error) {
        console.error("Error setting up tag filters:", error);
        throw error;
      }
    }

    //todo: First, get the post IDs that match the filters
    const postIds = await prisma.post.findMany({
      where,
      select: { id: true },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    });

    //todo: Then get the full post data with relations
    const posts = await prisma.post.findMany({
      where: { id: { in: postIds.map((p) => p.id) } },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { publishedAt: "desc" },
    });

    //todo: Get total count for pagination
    const total = await prisma.post.count({ where });

    //todo: Format the response
    const results: SearchResult[] = await Promise.all(
      posts.map(async (post) => {
        // Get category
        const category = post.categoryId
          ? await prisma.category.findUnique({
            where: { id: post.categoryId },
            select: { id: true, name: true, slug: true },
          })
          : null;

        //todo: Get tags
        const tags = await prisma.tag.findMany({
          where: { id: { in: post.tagIds } },
          select: { id: true, name: true, slug: true },
        });

        //todo: Get author
        const author = await prisma.user.findUnique({
          where: { id: post.authorId },
          select: { id: true, name: true, image: true },
        });

        return {
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug,
          category: category
            ? {
              id: category.id,
              name: category.name,
              slug: category.slug,
            }
            : null,
          tags: tags.map((tag) => ({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
          })),
          publishedAt: post.publishedAt?.toISOString() || null,
          readingTime: post.readingTime,
          author: author
            ? {
              id: author.id,
              name: author.name || "Unknown",
              image: author.image,
            }
            : null,
          coverImage: post.coverImage,
        };
      })
    );

    const response = {
      results,
      meta: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Search error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const errorStack = error instanceof Error ? error.stack : undefined;
    const typedError = error as ErrorWithInfo;

    console.error("Search error details:", {
      message: errorMessage,
      stack: errorStack,
      name: error instanceof Error ? error.name : "UnknownError",
      code: typedError.code,
      meta: typedError.meta,
    });

    return NextResponse.json(
      {
        error: "Failed to perform search",
        message: errorMessage,
        details:
          process.env.NODE_ENV === "development"
            ? {
              stack: errorStack,
              name: error instanceof Error ? error.name : "UnknownError",
              code: typedError.code,
              meta: typedError.meta,
            }
            : undefined,
      },
      { status: 500 }
    );
  }
}
