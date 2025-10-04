import { Suspense } from "react";
import { Metadata } from "next";
import { TrendingPosts } from "@/components/trending/trending-page";

export const metadata: Metadata = {
  title: "Trending Posts",
  description: "Discover the most engaging and popular posts on our platform",
};

export default function TrendingPage() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-7xl py-6 lg:py-10">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
              <div className="h-10 w-full max-w-md animate-pulse rounded-md bg-muted" />
              <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <TrendingPosts />
    </Suspense>
  );
}
