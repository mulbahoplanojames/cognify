import HomeHeroSection from "@/components/home/home-hero-section";
import OurMissionSection from "@/components/home/our-mission";
import WhyChooseUsSection from "@/components/home/why-choose-us-section";
import PremiumLibraryContentSection from "@/components/home/premium-library-content";
import CTASection from "@/components/home/cta-section";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { PostStatus } from "@/types/prisma-types";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const posts = await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
    },
    orderBy: {
      createdAt: "desc",
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
        select: { comments: true, reactions: true, bookmarks: true },
      },
    },
  });

  return (
    <>
      <HomeHeroSection session={session} />
      <OurMissionSection />
      <PremiumLibraryContentSection posts={posts} />
      <WhyChooseUsSection />
      <CTASection session={session} />
    </>
  );
}
