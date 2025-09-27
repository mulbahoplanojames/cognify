"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import SearchHero from "@/components/search/search-hero";

interface SearchResponse {
  results: SearchResult[];
  meta: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

type SearchResult = {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  category: {
    id: string;
    name: string;
  } | null;
  tags: Array<{
    id: string;
    name: string;
  }>;
  publishedAt: string | null;
  readingTime: number | null;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  coverImage: string | null;
};

type Category = {
  id: string;
  name: string;
};

type Tag = {
  id: string;
  name: string;
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const router = useRouter();

  // Debounce search input
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch available categories and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await fetch("/api/v1/admin/categories");
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setAvailableCategories(categoriesData);
        }

        // Fetch tags
        const tagsRes = await fetch("/api/v1/admin/tags");
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setAvailableTags(tagsData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Search when debounced query or filters change
  useEffect(() => {
    if (
      debouncedSearchQuery ||
      selectedCategories.length > 0 ||
      selectedTags.length > 0
    ) {
      setHasSearched(true);
      performSearch(debouncedSearchQuery);
    } else if (hasSearched) {
      setResults([]);
    }
  }, [debouncedSearchQuery, selectedCategories, selectedTags, sortBy]);

  // Handle page changes
  useEffect(() => {
    if (hasSearched) {
      performSearch(debouncedSearchQuery, pagination.currentPage);
    }
  }, [pagination.currentPage]);

  const performSearch = async (query: string, page: number = 1) => {
    try {
      setIsSearching(true);
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: pagination.limit.toString(),
        // ...(sortBy && { sort: sortBy }),
        ...(selectedCategories.length > 0 && {
          categories: selectedCategories.join(","),
        }),
        ...(selectedTags.length > 0 && { tags: selectedTags.join(",") }),
      });

      const response = await fetch(`/api/v1/search?${params.toString()}`);
      if (!response.ok) throw new Error("Search failed");

      const data: SearchResponse = await response.json();
      setResults(data.results || []);

      setPagination({
        currentPage: data.meta.currentPage,
        totalPages: data.meta.totalPages,
        totalItems: data.meta.total,
        limit: data.meta.limit,
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      searchQuery.trim() ||
      selectedCategories.length > 0 ||
      selectedTags.length > 0
    ) {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
      setHasSearched(true);
      performSearch(searchQuery, 1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setHasSearched(false);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      limit: 10,
    });
  };

  const toggleCategory = useCallback(
    (categoryId: string) => {
      setSelectedCategories((prev: string[]) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId]
      );
      setHasSearched(true);
    },
    [setSelectedCategories, setHasSearched]
  );

  const toggleTag = useCallback(
    (tag: Tag) => {
      setSelectedTags((prev: string[]) => {
        const newTags = prev.includes(tag.id)
          ? prev.filter((id) => id !== tag.id)
          : [...prev, tag.id];
        return newTags;
      });
      setHasSearched(true);
    },
    [setSelectedTags, setHasSearched]
  );

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSortBy("");
    setSearchQuery("");
    setHasSearched(false);
  }, [
    setSelectedCategories,
    setSelectedTags,
    setSortBy,
    setSearchQuery,
    setHasSearched,
  ]);

  return (
    <div className=" pt-8">
      <SearchHero
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        clearSearch={clearSearch}
        clearFilters={clearFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        sortBy={sortBy}
        availableTags={availableTags}
        selectedTags={selectedTags}
        availableCategories={availableCategories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        toggleTag={toggleTag}
        setSortBy={setSortBy}
      />

      <div className="bg-muted/20 py-14">
        <div className="container mx-auto">
          {isSearching ? (
            <div className="space-y-6 ">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <Skeleton className="h-6 rounded w-3/4 mb-4" />
                    <Skeleton className="h-4 rounded w-full mb-2" />
                    <Skeleton className="h-4 rounded w-5/6 mb-4" />
                    <div className="flex space-x-4">
                      <Skeleton className="h-4 rounded w-24" />
                      <Skeleton className="h-4 rounded w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="space-y-6">
                {results.map((result) => (
                  <Card
                    key={result.id}
                    className="hover:shadow-lg group transition-shadow"
                  >
                    <CardContent className="py-2 px-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="secondary">
                              {result.category?.name || "Uncategorized"}
                            </Badge>
                            {result.tags?.slice(0, 3).map((tag) => (
                              <Badge key={tag.id} variant="outline">
                                {tag.name}
                              </Badge>
                            ))}
                            {result.tags?.length > 3 && (
                              <Badge variant="outline">
                                +{result.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                          <Link
                            href={`/posts/${result.slug}`}
                            className="text-xl font-semibold mb-2 group-hover:text-blue-600"
                          >
                            {result.title}
                          </Link>
                          <p className="dark:text-gray-400 mb-4">
                            {result.excerpt}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span>{result.author?.name || "Unknown"}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span className="whitespace-nowrap">
                                {result.publishedAt
                                  ? formatDate(result.publishedAt)
                                  : "No date"}
                              </span>
                            </div>
                            {result.readingTime && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{result.readingTime} min read</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav
                    className="flex items-center gap-1"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1 || isSearching}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        let pageNum: number;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.currentPage >=
                          pagination.totalPages - 2
                        ) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-md border ${
                              pagination.currentPage === pageNum
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-100"
                            }`}
                            disabled={isSearching}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}

                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages ||
                        isSearching
                      }
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </nav>

                  <div className="ml-4 text-sm text-gray-500 flex items-center">
                    {pagination.totalItems > 0 ? (
                      <>
                        Showing{" "}
                        <span className="font-medium mx-1">
                          {(pagination.currentPage - 1) * pagination.limit + 1}
                        </span>
                        to{" "}
                        <span className="font-medium mx-1">
                          {Math.min(
                            pagination.currentPage * pagination.limit,
                            pagination.totalItems
                          )}
                        </span>
                        of{" "}
                        <span className="font-medium ml-1">
                          {pagination.totalItems}
                        </span>{" "}
                        results
                      </>
                    ) : (
                      "No results found"
                    )}
                  </div>
                </div>
              )}
            </>
          ) : results.length === 0 && hasSearched && !isSearching ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-500">
                Try different keywords or remove search filters
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium  mb-1">Search for content</h3>
              <p className="text-gray-500">
                Enter keywords to find articles, guides, and more
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
