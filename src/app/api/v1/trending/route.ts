import { prisma } from "@/lib/prisma";
import type { PostWithAuthor } from "@/types/post";
import { PostStatus } from "@/types/prisma-types";
import { NextResponse } from "next/server";
import { Prisma } from "../../../../../generated/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 10;
    const days = Number(searchParams.get("days")) || 7;
    const searchQuery = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sortBy = searchParams.get("sortBy") || "score";

    // Get all categories for the filter dropdown
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            posts: {
              where: {
                status: "PUBLISHED",
                publishedAt: {
                  gte:
                    days > 0
                      ? new Date(Date.now() - days * 24 * 60 * 60 * 1000)
                      : undefined,
                },
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const posts = await getTrendingPost(limit, days, searchQuery, category);

    // Apply sorting
    if (sortBy === "newest") {
      posts.sort(
        (a, b) =>
          (b.publishedAt ? new Date(b.publishedAt).getTime() : 0) -
          (a.publishedAt ? new Date(a.publishedAt).getTime() : 0)
      );
    } else if (sortBy === "reactions") {
      posts.sort((a, b) => (b?.reactionCount || 0) - (a?.reactionCount || 0));
    } else if (sortBy === "comments") {
      posts.sort((a, b) => (b?.commentCount || 0) - (a?.commentCount || 0));
    } else if (sortBy === "views") {
      posts.sort((a, b) => (b?.viewCount || 0) - (a?.viewCount || 0));
    } // 'score' is the default sorting in getTrendingPosts

    return NextResponse.json({
      posts,
      categories: categories.map((cat) => ({
        ...cat,
        postCount: cat._count.posts,
      })),
    });
  } catch (error) {
    console.error("Trending posts error:", error);
    return NextResponse.json({ status: 500 });
  }
}

interface PostWithMetrics {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  publishedAt: Date | null;
  readingTime: number | null;
  status: PostStatus;
  views: number;
  author: {
    id: string;
    name: string;
    image: string | null;
    username: string | null;
  };
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
  _count: {
    comments: number;
    reactions: number;
    bookmarks: number;
  };
  reactions: Array<{ type: "LIKE" | "CLAP" | "INSIGHTFUL" }>;
  score?: number;
  reactionCount?: number;
  commentCount?: number;
  viewCount?: number;
}

async function getTrendingPost(
  limit: number = 10,
  days: number = 7,
  searchQuery: string = "",
  categorySlug: string = ""
): Promise<PostWithAuthor[]> {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - days);

  // Build the where clause
  const where: Prisma.PostWhereInput = {
    status: "PUBLISHED",
    ...(days > 0 && { publishedAt: { gte: dateThreshold } }),
  };

  // Add search query filter
  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { excerpt: { contains: searchQuery, mode: "insensitive" } },
      { content: { contains: searchQuery, mode: "insensitive" } },
      { author: { name: { contains: searchQuery, mode: "insensitive" } } },
    ];
  }

  // Add category filter
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  // Get all published posts matching the filters
  const posts = await prisma.post.findMany({
    where,
    include: {
      author: {
        select: { id: true, name: true, username: true, image: true },
      },
      category: {
        select: { id: true, name: true, slug: true },
      },
      tags: {
        select: { id: true, name: true, slug: true },
      },
      _count: {
        select: {
          comments: {
            where: days > 0 ? { createdAt: { gte: dateThreshold } } : undefined,
          },
          reactions: {
            where: days > 0 ? { createdAt: { gte: dateThreshold } } : undefined,
          },
          bookmarks: true,
        },
      },
      reactions: {
        select: {
          type: true,
          createdAt: true, // Add this line to include the createdAt field
        },
        where: days > 0 ? { createdAt: { gte: dateThreshold } } : undefined,
      },
    },
    orderBy: { publishedAt: "desc" as const },
  });

  // Filter out posts with null authors and calculate scores
  const postsWithScores = posts
    .filter((post): post is PostWithAuthor => {
      if (!post || !post.author || !post.author.name) return false;

      // Check for all required properties
      const hasRequiredProperties =
        "id" in post &&
        "title" in post &&
        "slug" in post &&
        "content" in post &&
        "publishedAt" in post &&
        "status" in post &&
        "views" in post &&
        "_count" in post &&
        "reactions" in post;

      if (!hasRequiredProperties) return false;

      // Validate category structure if it exists
      if (post.category !== null && post.category !== undefined) {
        if (
          typeof post.category !== "object" ||
          !("id" in post.category) ||
          !("name" in post.category) ||
          !("slug" in post.category)
        ) {
          return false;
        }
      }

      // Validate tags if they exist
      if ("tags" in post && post.tags) {
        const isValidTags =
          Array.isArray(post.tags) &&
          post.tags.every(
            (tag) =>
              tag &&
              typeof tag === "object" &&
              "id" in tag &&
              "name" in tag &&
              "slug" in tag
          );
        if (!isValidTags) return false;
      }

      // Validate reaction types
      const validReactionTypes = ["LIKE", "CLAP", "INSIGHTFUL"];
      if (
        !post.reactions.every(
          (r) => "type" in r && validReactionTypes.includes(r.type)
        )
      ) {
        return false;
      }

      return true;
    })
    .map((post) => {
      const reactionScore = post._count.reactions * 2;
      const commentScore = post._count.comments * 3;
      const viewScore = post.views ? post.views * 0.1 : 0;
      const bookmarkScore = post._count.bookmarks * 1.5;

      // Calculate time decay (older posts get a lower score)
      const hoursSincePublished = post.publishedAt
        ? (Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60)
        : 0;
      const timeDecay = Math.pow(0.99, hoursSincePublished / 24); // 1% decay per day

      const score =
        (reactionScore + commentScore + viewScore + bookmarkScore) * timeDecay;

      return {
        ...post,
        score,
        reactionCount: post._count.reactions,
        commentCount: post._count.comments,
        viewCount: post.views || 0,
      };
    });

  // Sort by score in descending order, take the top N posts, and map to PostWithAuthor
  return postsWithScores
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit)
    .map(
      ({
        _count,
        reactions,
        score,
        reactionCount,
        commentCount,
        viewCount,
        ...post
      }) =>
        ({
          ...post,
          status: post.status as PostStatus,
          author: {
            id: post.author.id,
            name: post.author.name,
            image: post.author.image,
          },
          _count: {
            comments: commentCount || 0,
            reactions: reactionCount || 0,
          },
          views: viewCount,
          reactionCount,
          commentCount,
          score,
        } as unknown as PostWithAuthor)
    );
}
