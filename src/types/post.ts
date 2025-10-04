import { User } from "@/lib/prisma";
import { PostStatus, ReactionType } from "@/types/prisma-types";

export type PostWithAuthor = {
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
  author: Pick<User, "id" | "name" | "image"> & {
    username: string | null;
  };
  _count: {
    comments: number;
    reactions: number;
    bookmarks: number;
  };
  reactions: Array<{
    type: ReactionType;
    createdAt: Date;
  }>;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  score?: number;
  reactionCount?: number;
  commentCount?: number;
  viewCount?: number;
};

export type TrendingPost = PostWithAuthor & {
  score: number;
  reactionCount: number;
  commentCount: number;
  viewCount: number;
};

export type SearchParams = {
  timeRange?: string;
  sortBy?: "score" | "newest" | "reactions" | "comments" | "views";
  q?: string;
  category?: string;
  [key: string]: string | string[] | undefined;
};
