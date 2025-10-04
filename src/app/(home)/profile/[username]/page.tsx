import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  LinkIcon,
  Github,
  Twitter,
  BookOpen,
  Building2,
  MapPin,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FollowButton } from "@/components/social/follow-button";
import { PostStatus } from "@/types/prisma-types";

type Skill = {
  id: string;
  name: string;
};
type Project = {
  id: string;
  name: string;
  description: string;
  url: string;
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const { username } = await params;

  const user = await prisma.user.findFirst({
    where: { name: decodeURIComponent(username) },
    include: {
      _count: {
        select: {
          posts: { where: { status: PostStatus.PUBLISHED } },
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  //todo: Get user posts
  const posts = await prisma.post.findMany({
    where: {
      authorId: user.id,
      status: PostStatus.PUBLISHED,
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
    orderBy: { createdAt: "desc" },
  });

  //todo: Default social links if not provided
  const social = {
    website: "",
    github: "",
    twitter: "",
    ...(typeof user.social === "object" && user.social !== null
      ? user.social
      : {}),
  } as const;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-28">
      <div className="grid gap-6">
        {/* Profile Header */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="h-24 w-24 mx-auto md:mx-0">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback className="text-2xl">
                      {user.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="icon">
                      <Github className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground text-lg">
                    @{user.username || user.name}
                  </p>

                  {user.bio && (
                    <p className="mt-2 text-muted-foreground">{user.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        Joined{" "}
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    {social?.website && (
                      <a
                        href={social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        <LinkIcon className="h-4 w-4" />
                        <span>Website</span>
                      </a>
                    )}

                    {social?.github && (
                      <a
                        href={social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    )}

                    {social?.twitter && (
                      <a
                        href={social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        <Twitter className="h-4 w-4" />
                        <span>Twitter</span>
                      </a>
                    )}
                  </div>

                  <div className="flex gap-6 mt-4 justify-center md:justify-start">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {user._count.posts}
                      </div>
                      <div className="text-sm text-muted-foreground">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {user._count.followers}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Following
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {user._count.following}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Followers
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {session.user.id === user.id ? (
                    <Link
                      href={`/profile/${user.name}/edit`}
                      className="w-full md:w-auto"
                    >
                      <Button className="w-full">Edit Profile</Button>
                    </Link>
                  ) : (
                    <>
                      <FollowButton userId={user.id} username={user.name} />
                      <Button variant="outline" className="w-full md:w-auto">
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Posts</span>
                <Badge variant="secondary">{user._count.posts}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Following</span>
                <Badge variant="secondary">{user._count.followers}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Followers</span>
                <Badge variant="secondary">{user._count.following}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Member since
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full overflow-x-auto">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                  <p className="text-muted-foreground">
                    This user hasn't published any posts yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle>
                      <Link
                        href={`/posts/${post.slug}`}
                        className="hover:text-primary"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                    {post.excerpt && (
                      <CardDescription>{post.excerpt}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {post.category && (
                        <Badge variant="secondary">{post.category.name}</Badge>
                      )}
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag.id} variant="outline">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Experience
                  </h3>
                  <p className="text-muted-foreground">
                    {user.experience ||
                      "This user hasn't added any experience yet."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </h3>
                  <p className="text-muted-foreground">
                    {user.location ||
                      "This user hasn't added any location yet."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company
                  </h3>
                  <p className="text-muted-foreground">
                    {user.company || "This user hasn't added any company yet."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.skills &&
                  Array.isArray(user.skills) &&
                  (user.skills as Skill[]).map((skill) => (
                    <Badge key={skill.id} variant="outline">
                      {skill.name}
                    </Badge>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card className=" w-full">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {user.projects &&
                  Array.isArray(user.projects) &&
                  (user.projects as Project[]).map((project) => (
                    <Card key={project.id} className="w-full group">
                      <CardHeader className="pb-0">
                        <Link
                          href={`${project.url}`}
                          className="hover:text-blue-700"
                          target="_blank"
                        >
                          <CardTitle className="text-lg font-semibold group-hover:text-blue-700">
                            {project.name}
                          </CardTitle>
                        </Link>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground pt-0">
                        <p>{project.description}</p>
                      </CardContent>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bookmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <h2>Bookmarks Coming Soon</h2>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
