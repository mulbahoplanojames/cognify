import { prisma } from "@/lib/prisma";
import { PostStatus } from "../../../../../generated/prisma";

export async function getContentStats() {
  const [
    totalPosts,
    publishedPosts,
    scheduledPosts,
    draftPosts,
    totalComments,
    recentPostsWithAuthor,
    totalReports,
  ] = await Promise.all([
    // Total posts count
    prisma.post.count(),

    // Published posts count
    prisma.post.count({
      where: { status: PostStatus.PUBLISHED },
    }),

    // Scheduled posts count
    prisma.post.count({
      where: {
        status: PostStatus.SCHEDULED,
        scheduledAt: { gte: new Date() },
      },
    }),

    // Draft posts count
    prisma.post.count({
      where: { status: PostStatus.DRAFT },
    }),

    // Total comments count
    prisma.comment.count(),

    // Recent posts with author info
    prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        comments: {
          select: { id: true },
        },
      },
    }),

    // Total reports count (if reports table exists)
    prisma.report.count().catch(() => 0),
  ]);

  // Get user data for each post
  const recentPosts = await Promise.all(
    recentPostsWithAuthor.map(async (post) => {
      // Get report count for each post
      // const reportCount = await prisma.report
      //   .count({
      //     where: { postId: post.id, status: "OPEN" },
      //   })
      //   .catch(() => 0);

      const reportCount = await prisma.report
        .count({
          where: {
            targetType: "POST", // Make sure to use the correct enum value
            targetId: post.id,
            status: "OPEN",
          },
        })
        .catch(() => 0);

      return {
        id: post.id,
        title: post.title,
        author: post.author.name || "Unknown",
        status: post.status,
        createdAt: post.createdAt.toISOString(),
        reports: reportCount,
        comments: post.comments?.length || 0,
        excerpt: post.excerpt || "",
      };
    })
  );

  return {
    stats: {
      totalPosts,
      publishedPosts,
      scheduledPosts,
      draftPosts,
      totalComments,
      totalReports,
      // These are placeholders since we're not using them in the UI yet
      pendingPosts: 0,
      flaggedPosts: 0,
      pendingComments: 0,
      openReports: 0,
    },
    recentPosts,
  };
}
