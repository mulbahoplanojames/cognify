import { auth } from "@/lib/auth";
import React from "react";
import { headers } from "next/headers";
import HomeHeroSection from "@/components/home/home-hero-section";
import OurMissionPage from "@/components/home/our-mission";
import PremiumLibraryContent from "@/components/home/premium-library-content";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <HomeHeroSection />
      <OurMissionPage />
      <PremiumLibraryContent />
      <pre className="mt-28">{JSON.stringify(session, null, 2)}</pre>
    </>
  );
}
