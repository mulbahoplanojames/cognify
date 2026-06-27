import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface UserBookmarksProps {
  bookmarks: any[];
}

export default function UserBookmarks({ bookmarks }: UserBookmarksProps) {

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bookmarks</CardTitle>
        </CardHeader>
        <CardContent>
          {bookmarks.length === 0 ? (
            <p>No bookmarks found</p>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="bg-card/50 shadow-md group">
                  <CardHeader className="pb-0">
                    <Link
                      href={`/posts/${bookmark.post.slug}`}
                      className="group-hover:text-blue-500"
                    >
                      <h3 className="text-xl font-bold">
                        {bookmark.post.title}
                      </h3>
                    </Link>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{
                        __html: bookmark.post.content.slice(0, 200) + " ...",
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
