import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Clock, Star, User } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { premiumLibrary } from "@/data/home-page";

export default function PremiumLibraryContent() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Premium Content Library</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Curated by experts and educators, designed for students and lifelong
            learners who strive for excellence.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Featured Premium Article */}
          {(() => {
            const featuredArticle = premiumLibrary.find((a) => a.featured);
            if (!featuredArticle) return null;
            return (
              <div
                key={featuredArticle.id || featuredArticle.title}
                className="lg:col-span-2"
              >
                <Card className="premium-shadow p-0 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/50">
                  <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg"></div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 mb-3">
                      {featuredArticle.featured && (
                        <Badge className="bg-primary text-primary-foreground">
                          Featured
                        </Badge>
                      )}
                      <Badge variant="outline">Premium</Badge>
                    </div>
                    <CardTitle className="text-2xl mb-3">
                      {featuredArticle.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {featuredArticle.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{featuredArticle.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{featuredArticle.readTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          <span>{featuredArticle.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })()}

          {/* Premium Articles List */}
          <div className="space-y-6">
            {premiumLibrary
              .filter((a) => !a.featured)
              .slice(0, 2)
              .map((article) => (
                <Card
                  key={article.id}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="lg:h-36 md:h-56 h-44 bg-red-400"></div>
                    <CardTitle className="text-lg line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{article.author}</span>
                      <div className="flex items-center gap-3">
                        <span>{article.readTime}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          <span>{article.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </div>
        </div>
        <div className="flex justify-center">
          <Link href="/premium-content">
            <Button className="mt-6">Load More</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
