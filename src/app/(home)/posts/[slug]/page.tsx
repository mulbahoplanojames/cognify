import { notFound } from "next/navigation";
import { CommentSection } from "@/components/social/comment-section";
import { ReactionButtons } from "@/components/social/reaction-buttons";
import { BookmarkButton } from "@/components/social/bookmark-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { ShareButtons } from "@/components/social/share-buttons";
import { ReadingProgress } from "@/components/social/reading-progress";
import posts from "@/data/sample-posts.json";
import BackButton from "@/components/ui/back-button";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = posts.find((post) => post.slug === params.slug);
  const relatedPosts = posts
    .filter(
      (p) =>
        p.id !== post?.id &&
        p.tags.some((tag: any) =>
          post?.tags.map((t: any) => t.id).includes(tag.id)
        )
    )
    .slice(0, 4);

  if (!post) {
    notFound();
  }

  return (
    <>
      <ReadingProgress />

      <article className="container mx-auto px-4 pb-8 pt-40 max-w-4xl">
        <BackButton />
        {/* Post Header */}
        <header className="mb-8 mt-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            {post.category && (
              <Badge variant="secondary">{post.category.name}</Badge>
            )}
            <CalendarDays className="h-4 w-4" />
            <time
              dateTime={
                // post.publishedAt?.toISOString() || post.createdAt.toISOString()
                post.publishedAt || post.createdAt
              }
            >
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : new Date(post.createdAt).toLocaleDateString()}
            </time>
            {post.readingTime && (
              <>
                <Clock className="h-4 w-4 ml-2" />
                <span>{post.readingTime} min read</span>
              </>
            )}
            <Eye className="h-4 w-4 ml-2" />
            <span>{post.views} views</span>
          </div>

          <h1 className="text-4xl font-bold mb-4 text-balance">{post.title}</h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Author Info */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href={`/profile/${post.author.username}`}
              className="flex items-center gap-3"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={post.author.image || ""}
                  alt={post.author.name || ""}
                />
                <AvatarFallback>
                  {post.author.name?.[0] || post.author.username[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {post.author.name || post.author.username}
                </p>
                <p className="text-sm text-muted-foreground">
                  @{post.author.username}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <ReactionButtons targetId={post.id} targetType="post" />
              <BookmarkButton postId={post.id} />
              <ShareButtons
                url={`${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.slug}`}
                title={post.title}
                description={post.excerpt || ""}
              />
            </div>
          </div>

          <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="font-medium">247 likes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              <span className="font-medium">32 comments</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Bookmark className="h-4 w-4 text-green-500" />
              <span className="font-medium">89 bookmarks</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Trending #3</span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8">
            <img
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg premium-shadow"
            />
          </div>
        )}

        <div className=" gap-8 mb-12">
          <div>
            {/* Post Content */}
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag.id} href={`/search?tags=${tag.id}`}>
                  <Badge
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Related Posts</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <Card
                  key={relatedPost.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Link
                        href={`/posts/${relatedPost.slug}`}
                        className="hover:text-primary"
                      >
                        {relatedPost.title}
                      </Link>
                    </CardTitle>
                    {relatedPost.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {relatedPost.author.name || relatedPost.author.username}
                      </span>
                      <span>•</span>
                      <span>
                        {relatedPost.publishedAt
                          ? new Date(
                              relatedPost.publishedAt
                            ).toLocaleDateString()
                          : new Date(
                              relatedPost.createdAt
                            ).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <CommentSection postId={post.id} />
      </article>
    </>
  );
}
