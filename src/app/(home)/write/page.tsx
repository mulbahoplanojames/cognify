"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Save,
  Send,
  Plus,
  Edit,
  Clock,
  Eye,
  Calendar,
  Tag,
  Folder,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Post } from "@/lib/prisma";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function WritePage() {
  const session = useSession();
  const loginUser = session.data?.user;
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("new");
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  // Define the form state type
  type FormData = {
    id?: string;
    authorId: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    ogImage: string;
    status: "DRAFT" | "PENDING" | "PUBLISHED" | "ARCHIVED";
    scheduledAt: string | null;
    publishedAt: string | null;
    readingTime: number | null;
    categoryId: string | null;
    tagIds: string[];
  };

  // State for the form (without id initially)
  const [formData, setFormData] = useState<FormData>({
    authorId: loginUser?.id || "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    ogImage: "",
    status: "DRAFT",
    scheduledAt: null,
    publishedAt: null,
    readingTime: 0,
    tagIds: [],
    categoryId: null,
  });

  //todo: State for UI elements
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  //todo: Helper function to update form data
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(updates).filter(([key]) => key !== "id")
      ),
    }));
  };

  //todo: Update title and generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");

    updateFormData({ title, slug });
  };

  //todo: Update content and calculate reading time
  const handleContentChange = (content: string) => {
    const text = content.replace(/<[^>]*>/g, "");
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    updateFormData({ content, readingTime });
  };

  useEffect(() => {
    loadUserPosts();
  }, []);

  //Todo: This function is used to load the user posts
  const loadUserPosts = async () => {
    try {
      const response = await fetch("/api/v1/posts/user");
      if (response.ok) {
        const posts = await response.json();
        setUserPosts(posts);
      }
    } catch (error) {
      console.error("Failed to load user posts:", error);
    }
  };

  //todo: Fetch categories and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryresponse = await fetch("/api/v1/admin/categories");
        const categories = await categoryresponse.json();
        setCategories(categories);
        console.log("categories", categories);

        const tagresponse = await fetch("/api/v1/admin/tags");
        const tags = await tagresponse.json();
        console.log("tags", tags);
        setTags(tags);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //todo: Handle form submission
  const handleSubmit = async (status: Post["status"] | "PUBLISHED") => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Error", {
        description: "Title and content are required",
      });
      return;
    }

    // console.log("formData", formData);

    setIsLoading(true);

    try {
      //todo: Create a sanitized post data object with proper date handling
      const postData = {
        ...formData,
        status,
        categoryId: selectedCategory || null,
        tagIds: selectedTags,
        scheduledAt: status === "SCHEDULED" && date ? date.toISOString() : null,
        publishedAt: status === "PUBLISHED" ? new Date().toISOString() : null,
      };

      //todo: Determine if this is an update or create operation
      const isUpdate = "id" in postData && postData.id;
      const url = isUpdate ? `/api/v1/posts/${postData.id}` : "/api/v1/posts";
      const method = isUpdate ? "PUT" : "POST";

      //todo: Remove id for new posts
      const requestData = isUpdate
        ? postData
        : (() => {
            const { id, ...data } = postData as any;
            return data;
          })();

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      // Reset form
      updateFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        ogImage: "",
        status: "DRAFT",
        scheduledAt: null,
        publishedAt: null,
        readingTime: 0,
        tagIds: [],
        categoryId: null,
      });

      setSelectedTags([]);
      setSelectedCategory("");
      setDate(undefined);

      toast("Success", {
        description: `Post ${
          formData.id ? "updated" : "created"
        } successfully!`,
      });

      // Reload posts
      await loadUserPosts();

      // If this was a new post, switch to drafts tab
      if (!formData.id) {
        setActiveTab("drafts");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Error", {
        description: "Failed to save post. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing an existing post
  const handleEditPost = (post: Post) => {
    // Update form data with the post data (excluding id from the form state)
    const { id, createdAt, updatedAt, views, authorId, ...postData } = post;

    // Convert dates to strings for the form
    updateFormData({
      ...postData,
      excerpt: postData.excerpt || "", // Ensure excerpt is never null
      scheduledAt: post.scheduledAt || null,
      publishedAt: post.publishedAt || null,
    });

    //todo: Update UI state
    setSelectedTags(post.tagIds || []);
    setSelectedCategory(post.categoryId || "");
    setDate(post.scheduledAt ? new Date(post.scheduledAt) : undefined);
    setActiveTab("new");
  };

  //todo: Handle tag selection
  const toggleTag = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id: string) => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(newTags);
    updateFormData({ tagIds: newTags });
  };

  //todo: Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    updateFormData({ categoryId });
  };

  //todo: Handle cover image upload
  const handleCoverImageUpload = (url: string) => {
    updateFormData({ coverImage: url });
  };

  //todo: Handle OG image upload
  const handleOgImageUpload = (url: string) => {
    updateFormData({ ogImage: url });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-18">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <div className="flex flex-wrap justify-end gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => handleSubmit("DRAFT")}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleSubmit("PENDING")}
            disabled={
              isLoading || !formData.title.trim() || !formData.content.trim()
            }
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Submit for Review
          </Button>
          <Button
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={
              isLoading || !formData.title.trim() || !formData.content.trim()
            }
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Publish Now
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </TabsTrigger>
          <TabsTrigger value="drafts" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Drafts ({userPosts.filter((p) => p.status === "DRAFT").length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending ({userPosts.filter((p) => p.status === "PENDING").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
                <CardDescription>
                  Fill in the details of your post. All fields are required
                  unless marked as optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="Enter post title..."
                      className="text-lg"
                    />
                    <p className="text-xs text-muted-foreground">
                      URL: {formData.slug || "your-post-url"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Button
                        key={tag.id}
                        type="button"
                        variant={
                          selectedTags.includes(tag.id) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      updateFormData({ excerpt: e.target.value })
                    }
                    placeholder="Brief description of your post..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    A short summary of your post that will appear in search
                    results and social media.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <FileUpload
                      onUpload={handleCoverImageUpload}
                      currentImage={formData.coverImage}
                      onRemove={() => updateFormData({ coverImage: "" })}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 1200x630px
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Open Graph Image (OG Image)</Label>
                    <FileUpload
                      onUpload={handleOgImageUpload}
                      currentImage={formData.ogImage}
                      onRemove={() => updateFormData({ ogImage: "" })}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Custom image for social sharing (optional)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Schedule Publication</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={"w-full justify-start text-left font-normal"}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">
                    {date
                      ? `Post will be published on ${format(
                          date,
                          "PPP 'at' p"
                        )}`
                      : "Leave empty to publish immediately"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>
                  Write your post content here. Use the toolbar to format your
                  text.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  content={formData.content}
                  onChange={handleContentChange}
                  placeholder="Start writing your post..."
                />
                <div className="mt-2 text-sm text-muted-foreground flex justify-between">
                  <span>
                    {formData.readingTime
                      ? `${formData.readingTime} min read`
                      : "Reading time will be calculated"}
                  </span>
                  <span>
                    {formData.content.replace(/<[^>]*>/g, "").trim().length}{" "}
                    characters
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Draft Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {userPosts.filter((p) => p.status === "DRAFT").length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Edit className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No drafts yet. Start writing your first post!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPosts
                    .filter((p) => p.status === "DRAFT")
                    .map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{post.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">Draft</Badge>
                            <span className="text-xs text-muted-foreground">
                              Updated
                              {new Date(post.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPost(post)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/posts/${post.slug}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Posts Awaiting Publication</CardTitle>
            </CardHeader>
            <CardContent>
              {userPosts.filter((p) => p.status === "PENDING").length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No posts pending review.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPosts
                    .filter((p) => p.status === "PENDING")
                    .map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{post.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className="text-yellow-600 border-yellow-600"
                            >
                              Pending Review
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Submitted{" "}
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`/posts/${post.slug}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </a>
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
