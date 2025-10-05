import { CommentStatus, type User, type Comment } from "@prisma/client";
import { prisma } from "../prisma";

export type CommentWithAuthor = Comment & {
  author: Pick<User, "id" | "name" | "image">;
  replies?: CommentWithAuthor[];
  _count: {
    reactions: number;
    replies: number;
  };
};

export interface CreateCommentData {
  body: string;
  postId: string;
  parentId?: string;
}

export class CommentService {
  static async createComment(
    authorId: string,
    data: CreateCommentData
  ): Promise<Comment> {
    return prisma.comment.create({
      data: {
        ...data,
        authorId,
        status: CommentStatus.VISIBLE,
      },
    });
  }

  static async getComments(postId: string): Promise<CommentWithAuthor[]> {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        status: CommentStatus.VISIBLE,
        parentId: null, // Only get top-level comments
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        replies: {
          where: { status: CommentStatus.VISIBLE },
          include: {
            author: {
              select: { id: true, name: true, image: true },
            },
            _count: {
              select: { reactions: true, replies: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: { reactions: true, replies: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return comments;
  }

  static async updateComment(
    commentId: string,
    body: string
  ): Promise<Comment> {
    return prisma.comment.update({
      where: { id: commentId },
      data: {
        body,
        editedAt: new Date(),
      },
    });
  }

  static async deleteComment(commentId: string): Promise<void> {
    await prisma.comment.update({
      where: { id: commentId },
      data: {
        status: CommentStatus.DELETED,
        body: "[deleted]",
      },
    });
  }

  static async getComment(
    commentId: string
  ): Promise<CommentWithAuthor | null> {
    return prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { reactions: true, replies: true },
        },
      },
    });
  }
}
