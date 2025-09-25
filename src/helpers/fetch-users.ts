import { prisma } from "@/lib/prisma";

export const fetchUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const fetchPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        category: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            reactions: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};
