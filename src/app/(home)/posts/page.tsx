import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  User,
  Eye,
  MessageCircle,
  Heart,
  Star,
} from "lucide-react";
import HeroSection from "@/components/ui/hero-section";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PostStatus } from "@/types/prisma-types";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
    },
    orderBy: {
      createdAt: "desc",
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
        select: { comments: true, reactions: true, bookmarks: true },
      },
    },
  });

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="Discover Premium Content"
        description="Dive into tips, tutorials, and ideas from experts and innovators—perfect for students and learners ready to level up."
        postSearch={true}
        tab="Latest Insights & Tutorials"
      />

      <div className="container mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">No articles yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Be the first to share your insights and knowledge with our
              community of learners and professionals.
            </p>
            <Button asChild size="lg" className="premium-shadow">
              <Link href="/write">Write Your First Article</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Article */}
            {featuredPost && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-2xl font-bold">Featured Article</h2>
                </div>

                <Card className="hover:shadow-lg p-0 group transition-all duration-500 border-0 bg-gradient-to-br from-card to-muted/30 overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-2/3">
                      <CardHeader className="py-4 ">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-medium">
                              {featuredPost.author.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            <span>
                              {featuredPost.publishedAt
                                ? new Date(
                                    featuredPost.publishedAt
                                  ).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : new Date(
                                    featuredPost.createdAt
                                  ).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                            </span>
                          </div>
                          {featuredPost.readingTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{featuredPost.readingTime} min read</span>
                            </div>
                          )}
                        </div>

                        <CardTitle className="text-3xl mb-4 group-hover:text-blue-600 transition-colors">
                          <Link
                            href={`/posts/${featuredPost.slug}`}
                            className="line-clamp-2 cursor-pointer group-hover:text-blue-600"
                          >
                            {featuredPost.title}
                          </Link>
                        </CardTitle>

                        {featuredPost.excerpt && (
                          <CardDescription className="text-lg leading-relaxed line-clamp-3">
                            {featuredPost.excerpt}
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center justify-between pb-4">
                          <div className="flex gap-2">
                            {featuredPost.category && (
                              <Badge className="bg-primary text-primary-foreground">
                                {featuredPost.category.name}
                              </Badge>
                            )}
                            {featuredPost.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag.id} variant="outline">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{featuredPost.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{featuredPost._count.comments}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              <span>{featuredPost._count.reactions}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    <div className="md:w-1/3">
                      <div className="h-64 relative md:h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                        <div className="text-center p-6 z-10">
                          <Star className="h-16 w-16 text-primary/60 mx-auto mb-4" />
                          <p className="text-sm text-muted-foreground">
                            Featured Content
                          </p>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image
                            src={featuredPost.coverImage || "/placeholder.jpg"}
                            alt={featuredPost.title}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </section>
            )}

            {/* Regular Articles Grid */}
            {regularPosts.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Latest Articles</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{regularPosts.length} articles</span>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {regularPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="group pt-0 hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm overflow-hidden"
                    >
                      <div className="h-48 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          {post.category && (
                            <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
                              {post.category.name}
                            </Badge>
                          )}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image
                            src={post.coverImage || ""}
                            alt={post.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                              <User className="h-3 w-3 text-primary" />
                            </div>
                            <span>{post.author.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            <span>
                              {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )
                                : new Date(post.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                            </span>
                          </div>
                          {post.readingTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{post.readingTime}m</span>
                            </div>
                          )}
                        </div>

                        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-2">
                          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                        </CardTitle>

                        {post.excerpt && (
                          <CardDescription className="leading-relaxed line-clamp-2">
                            {post.excerpt}
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag.id}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag.name}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>{post._count.comments}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              <span>{post._count.reactions}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </>
  );
}
