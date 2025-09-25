import HeroSection from "@/components/ui/hero-section";
import React from "react";

export default function Searchpage() {
  return (
    <div className="relative pt-24 md:pt-28 container mx-auto px-4 py-8 max-w-6xl">
      <HeroSection
        title="Search"
        description="Search for posts, authors, and more"
        postSearch={true}
      />
      <h1 className="text-5xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti quis
        cupiditate accusantium quod nesciunt explicabo sunt quidem veniam dolor
        saepe perspiciatis magni repellendus vero corporis cum officiis dolores,
        voluptatem reprehenderit rerum consequuntur rem? Perspiciatis vel atque
        illum assumenda incidunt dicta tempora accusamus voluptatibus adipisci
        qui quo accusantium, numquam quisquam nulla.
      </h1>
    </div>
  );
}
