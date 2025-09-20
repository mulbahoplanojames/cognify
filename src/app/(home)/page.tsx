import { auth } from "@/lib/auth";
import React from "react";
import { headers } from "next/headers";
import HomeHeroSection from "@/components/home/home-hero-section";
import PremiumLibraryContent from "@/components/home/premium-library-content";
import OurMissionSection from "@/components/home/our-mission";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <HomeHeroSection />
      <OurMissionSection />
      <PremiumLibraryContent />
      <pre className="mt-28">{JSON.stringify(session, null, 2)}</pre>
    </>
  );
}
