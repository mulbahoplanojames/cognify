import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Filter, ChevronDown, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedGroup } from "@/components/ui/animated-group";
import Image from "next/image";
import Link from "next/link";
import { TextEffect } from "@/components/ui/text-effect";
import { transitionVariants } from "@/components/ui/hero-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Category = {
  id: string;
  name: string;
};

type Tag = {
  id: string;
  name: string;
};
export default function SearchHero({
  handleSearch,
  searchQuery,
  setSearchQuery,
  clearSearch,
  clearFilters,
  showFilters,
  setShowFilters,
  sortBy,
  availableTags,
  selectedTags,
  availableCategories,
  selectedCategories,
  toggleCategory,
  toggleTag,
  setSortBy,
}: {
  handleSearch: (e: React.FormEvent) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  clearFilters: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  sortBy: string;
  availableTags: Tag[];
  selectedTags: string[];
  availableCategories: Category[];
  selectedCategories: string[];
  toggleCategory: (categoryId: string) => void;
  toggleTag: (tag: Tag) => void;
  setSortBy: (sortBy: string) => void;
}) {
  return (
    <section className="overflow-hidden mb-10 relative z-0">
      <div
        aria-hidden
        className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
      >
        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>
      <section>
        <div className="relative pt-24 md:pt-32 pb-10">
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    delayChildren: 1,
                  },
                },
              },
              item: {
                hidden: {
                  opacity: 0,
                  y: 20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring" as const,
                    bounce: 0.3,
                    duration: 2,
                  },
                },
              },
            }}
            className="mask-b-from-35% mask-b-to-90% absolute inset-0 top-56 -z-20 lg:top-32"
          >
            <Image
              src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
              alt="background"
              className="hidden size-full dark:block"
              width="3276"
              height="4095"
            />
          </AnimatedGroup>

          <div
            aria-hidden
            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
          />

          <div className=" px-6">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
              <AnimatedGroup variants={transitionVariants}>
                <Link
                  href="#link"
                  className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                >
                  <span className="text-foreground text-sm">
                    Search our library
                  </span>
                  <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                  <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" />
                      </span>
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedGroup>

              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-10 xl:text-[5.25rem]"
              >
                Discover knowledge in our library
              </TextEffect>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="mx-auto my-8  max-w-3xl text-balance text-lg"
              >
                Explore our library by searching for specific keywords or
                filtering by categories, tags, and more.
              </TextEffect>

              <AnimatedGroup variants={transitionVariants}>
                <div className="max-w-3xl mx-auto">
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
                    <div className="mt-4 p-4 border rounded-lg space-y-1">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger>Tags</AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-wrap gap-2">
                              {availableTags.map((tag) => (
                                <Button
                                  key={tag.id}
                                  type="button"
                                  variant={
                                    selectedTags.includes(tag.id)
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => toggleTag(tag)}
                                  className="capitalize"
                                >
                                  {tag.name}
                                </Button>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>Categories</AccordionTrigger>
                          <AccordionContent>
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
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}

                  {selectedCategories.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedCategories.map((catId) => {
                        const category = availableCategories.find(
                          (c) => c.id === catId
                        );
                        return category ? (
                          <Badge
                            key={catId}
                            className="flex items-center gap-1"
                          >
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
              </AnimatedGroup>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
