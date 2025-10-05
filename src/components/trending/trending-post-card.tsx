import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { PostWithAuthor } from "@/types/post";
import { Eye, Heart, MessageSquare, Bookmark } from "lucide-react";

interface PostCardProps {
  post: PostWithAuthor;
  className?: string;
  showStats?: boolean;
}

export function TrendingPostCard({
  post,
  className,
  showStats = true,
}: PostCardProps) {
  return (
    <article
      className={cn("group relative flex flex-col space-y-2", className)}
    >
      {post.coverImage && (
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <Link href={`/posts/${post.slug}`}>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>
        </div>
      )}

      <div className="space-y-2">
        {post.category && (
          <Link
            href={`/categories/${post.category.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {post.category.name}
          </Link>
        )}

        <h2 className="line-clamp-2 text-xl font-semibold leading-snug">
          <Link href={`/posts/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            {post.author.image && (
              <div className="relative h-6 w-6 overflow-hidden rounded-full">
                <Image
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              </div>
            )}
            <Link
              href={`/profile/${post.author.name}`}
              className="hover:underline"
            >
              {post.author.name}
            </Link>
          </div>

          {post.publishedAt && (
            <time dateTime={new Date(post.publishedAt).toISOString()}>
              {formatDistanceToNow(new Date(post.publishedAt), {
                addSuffix: true,
              })}
            </time>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          {showStats && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm">
                <Eye className="h-4 w-4" />
                <span>{post.viewCount ?? post.views ?? 0}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Heart className="h-4 w-4" />
                <span>{post.reactionCount ?? post._count?.reactions ?? 0}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <MessageSquare className="h-4 w-4" />
                <span>{post.commentCount ?? post._count?.comments ?? 0}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Bookmark className="h-4 w-4" />
                <span>{post._count?.bookmarks ?? 0}</span>
              </div>
            </div>
          )}

          {post.readingTime && (
            <div className="text-sm text-muted-foreground">
              {post.readingTime} min read
            </div>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="rounded-full bg-muted px-3 py-1 text-xs hover:bg-muted/80"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
