"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { SearchParams, TrendingPost } from "@/types/post";
import { TrendingPostCard } from "@/components/trending/trending-post-card";
import HeroSection from "../ui/hero-section";

type TimeRangeValue = "1" | "7" | "30" | "0";
type SortByValue = "score" | "newest" | "reactions" | "comments" | "views";

interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

interface TrendingResponse {
  posts: TrendingPost[];
  categories: Category[];
}

const timeRanges = [
  { value: "1" as const, label: "Today" },
  { value: "7" as const, label: "This Week" },
  { value: "30" as const, label: "This Month" },
  { value: "0" as const, label: "All Time" },
];

const sortOptions = [
  { value: "score" as const, label: "Trending" },
  { value: "newest" as const, label: "Newest" },
  { value: "reactions" as const, label: "Most Reactions" },
  { value: "comments" as const, label: "Most Comments" },
  { value: "views" as const, label: "Most Views" },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function TrendingPosts() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [timeRange, setTimeRange] = useState<TimeRangeValue>(
    (searchParams?.get("timeRange") as TimeRangeValue) || "7"
  );

  const [sortBy, setSortBy] = useState<SortByValue>(
    (searchParams?.get("sortBy") as SortByValue) || "score"
  );

  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [category, setCategory] = useState(searchParams?.get("category") || "");
  const [posts, setPosts] = useState<TrendingPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const updateUrl = (updates: Partial<SearchParams>) => {
    if (!searchParams) return;

    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          days: timeRange,
          sortBy,
          ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
          ...(category && { category }),
        });

        const res = await fetch(`/api/v1/trending?${params}`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: TrendingResponse = await res.json();

        setPosts(data.posts);
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingPosts();
  }, [timeRange, sortBy, debouncedSearchQuery, category]);

  return (
    <>
      <HeroSection
        title="Trending Posts"
        description="Discover the most engaging content on our platform"
        tab="Trending"
        postSearch={false}
      />
      <div className="container max-w-7xl py-10 mx-auto md:px-6 px-2 lg:py-16">
        <div className="mt-8 flex flex-col space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search posts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    updateUrl({ q: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={timeRange}
                onValueChange={(value: TimeRangeValue) => {
                  setTimeRange(value);
                  updateUrl({ timeRange: value });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value: SortByValue) => {
                  setSortBy(value);
                  updateUrl({ sortBy: value });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!category ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCategory("");
                  updateUrl({ category: "" });
                }}
                className="text-sm"
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={category === cat.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCategory(cat.slug);
                    updateUrl({ category: cat.slug });
                  }}
                  className="text-sm"
                >
                  {cat.name} ({cat.postCount})
                </Button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <TrendingPostCard
                  key={post.id}
                  post={post}
                  className="h-full"
                  showStats={true}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                No posts found
              </p>
              <p className="max-w-md text-sm text-muted-foreground">
                Try adjusting your search or filter criteria to find what you're
                looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setCategory("");
                  setTimeRange("7");
                  setSortBy("score");
                  updateUrl({
                    q: "",
                    category: "",
                    timeRange: "7",
                    sortBy: "score",
                  });
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
