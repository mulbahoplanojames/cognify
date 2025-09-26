"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Calendar,
  User,
  Clock,
  X,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Search</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles, guides, and more..."
              className="pl-10 pr-4 py-6 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>
        <div className="mt-4 flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Relevance</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 border rounded-lg space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Button
                    key={tag.id}
                    type="button"
                    variant={
                      selectedTags.includes(tag.id) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => toggleTag(tag.id)}
                    className="capitalize"
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((category) => (
                  <Button
                    key={category.id}
                    type="button"
                    variant={
                      selectedCategories.includes(category.id)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedCategories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCategories.map((catId) => {
              const category = availableCategories.find((c) => c.id === catId);
              return category ? (
                <Badge key={catId} className="flex items-center gap-1">
                  {category.name}
                  <button
                    onClick={() => toggleCategory(catId)}
                    className="ml-1 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ) : null;
            })}
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-blue-600 hover:text-blue-700"
              onClick={clearFilters}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {isSearching ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
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
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary">
                          {result.category?.name || "Uncategorized"}
                        </Badge>
                        {result.tags?.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            className="bg-gray-50"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                        {result.tags?.length > 3 && (
                          <Badge variant="outline" className="bg-gray-50">
                            +{result.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold mb-2">
                        {result.title}
                      </h2>
                      <p className="text-gray-600 mb-4">{result.excerpt}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{result.author?.name || "Unknown"}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {formatDate(result.publishedAt)}
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
              <nav className="flex items-center gap-1" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
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
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
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
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Search for content
          </h3>
          <p className="text-gray-500">
            Enter keywords to find articles, guides, and more
          </p>
        </div>
      )}
    </div>
  );
}
