import { PostStatus } from "../../../generated/prisma";
import { Post, prisma } from "../prisma";

export interface SearchOptions {
  query?: string;
  tags?: string[];
  categoryId?: string;
  authorId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: "relevance" | "date" | "popularity";
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  posts: Post[];
  total: number;
  facets: {
    tags: Array<{ id: string; name: string; count: number }>;
    categories: Array<{ id: string; name: string; count: number }>;
    authors: Array<{
      id: string;
      name: string;
      username: string;
      count: number;
    }>;
  };
}

export class SearchService {
  static async searchPosts(options: SearchOptions): Promise<SearchResult> {
    const {
      query,
      tags,
      categoryId,
      authorId,
      dateFrom,
      dateTo,
      sortBy = "relevance",
      limit = 10,
      offset = 0,
    } = options;

    // Build where clause
    const where: any = {
      status: PostStatus.PUBLISHED,
    };

    // Text search
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
        { excerpt: { contains: query, mode: "insensitive" } },
      ];
    }

    // Filters
    if (tags?.length) {
      where.tags = {
        some: {
          id: { in: tags },
        },
      };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (dateFrom || dateTo) {
      where.publishedAt = {};
      if (dateFrom) where.publishedAt.gte = dateFrom;
      if (dateTo) where.publishedAt.lte = dateTo;
    }

    // Build order by
    let orderBy: any = { publishedAt: "desc" };
    if (sortBy === "popularity") {
      orderBy = { views: "desc" };
    } else if (sortBy === "date") {
      orderBy = { publishedAt: "desc" };
    }

    // Execute search
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
          tags: {
            select: { id: true, name: true, slug: true },
          },
          _count: {
            select: {
              comments: true,
              reactions: true,
              bookmarks: true,
            },
          },
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.post.count({ where }),
    ]);

    //todo: Get facets for filtering
    const facets = await this.getFacets(where);

    return {
      posts,
      total,
      facets,
    };
  }

  // Todo: Get facets for filtering
  static async getFacets(baseWhere: any) {
    const [tagFacets, categoryFacets, authorFacets] = await Promise.all([
      // Tag facets
      prisma.post
        .findMany({
          where: baseWhere,
          select: {
            tags: {
              select: { id: true, name: true },
            },
          },
        })
        .then((posts) => {
          const tagCounts = new Map<
            string,
            { id: string; name: string; count: number }
          >();
          posts.forEach((post) => {
            post.tags.forEach((tag) => {
              const existing = tagCounts.get(tag.id);
              if (existing) {
                existing.count++;
              } else {
                tagCounts.set(tag.id, { id: tag.id, name: tag.name, count: 1 });
              }
            });
          });
          return Array.from(tagCounts.values()).sort(
            (a, b) => b.count - a.count
          );
        }),

      // Category facets
      prisma.post
        .groupBy({
          by: ["categoryId"],
          where: { ...baseWhere, categoryId: { not: null } },
          _count: { categoryId: true },
        })
        .then(async (groups) => {
          const categoryIds = groups
            .map((g) => g.categoryId)
            .filter(Boolean) as string[];
          const categories = await prisma.category.findMany({
            where: { id: { in: categoryIds } },
            select: { id: true, name: true },
          });

          return groups
            .map((group) => {
              const category = categories.find(
                (c) => c.id === group.categoryId
              );
              return category
                ? {
                    id: category.id,
                    name: category.name,
                    count: group._count.categoryId,
                  }
                : null;
            })
            .filter(Boolean)
            .sort((a, b) => b!.count - a!.count) as Array<{
            id: string;
            name: string;
            count: number;
          }>;
        }),

      // Author facets
      prisma.post
        .groupBy({
          by: ["authorId"],
          where: baseWhere,
          _count: { authorId: true },
        })
        .then(async (groups) => {
          const authorIds = groups.map((g) => g.authorId);
          const authors = await prisma.user.findMany({
            where: { id: { in: authorIds } },
            select: { id: true, name: true },
          });

          return groups
            .map((group) => {
              const author = authors.find((a) => a.id === group.authorId);
              return author
                ? {
                    id: author.id,
                    name: author.name,
                    count: group._count.authorId,
                  }
                : null;
            })
            .filter(Boolean)
            .sort((a, b) => b!.count - a!.count) as Array<{
            id: string;
            name: string;
            username: string;
            count: number;
          }>;
        }),
    ]);

    return {
      tags: tagFacets,
      categories: categoryFacets,
      authors: authorFacets,
    };
  }

  // Todo: Get trending posts
  static async getTrendingPosts(limit = 10): Promise<Post[]> {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return prisma.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
        publishedAt: { gte: oneWeekAgo },
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        tags: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: {
            comments: true,
            reactions: true,
            bookmarks: true,
          },
        },
      },
      orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
      take: limit,
    });
  }

  // Todo: Get related posts
  static async getRelatedPosts(postId: string, limit = 5): Promise<Post[]> {
    // Get the current post's tags and category
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        categoryId: true,
        tags: { select: { id: true } },
      },
    });

    if (!currentPost) return [];

    const tagIds = currentPost.tags.map((tag) => tag.id);

    // Find related posts based on shared tags or category
    return prisma.post.findMany({
      where: {
        id: { not: postId },
        status: PostStatus.PUBLISHED,
        OR: [
          ...(tagIds.length > 0
            ? [
                {
                  tags: {
                    some: {
                      id: { in: tagIds },
                    },
                  },
                },
              ]
            : []),
          ...(currentPost.categoryId
            ? [{ categoryId: currentPost.categoryId }]
            : []),
        ],
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        tags: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: {
            comments: true,
            reactions: true,
            bookmarks: true,
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
  }

  // Todo: Get search suggestions
  static async getSearchSuggestions(
    query: string,
    limit = 5
  ): Promise<string[]> {
    if (!query || query.length < 2) return [];

    const posts = await prisma.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: { title: true },
      take: limit,
    });

    return posts.map((post) => post.title);
  }

  // Todo: Get popular tags
  static async getPopularTags(limit = 20) {
    const posts = await prisma.post.findMany({
      where: { status: PostStatus.PUBLISHED },
      select: {
        tags: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    const tagCounts = new Map<
      string,
      { id: string; name: string; slug: string; count: number }
    >();

    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        const existing = tagCounts.get(tag.id);
        if (existing) {
          existing.count++;
        } else {
          tagCounts.set(tag.id, { ...tag, count: 1 });
        }
      });
    });

    return Array.from(tagCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}
