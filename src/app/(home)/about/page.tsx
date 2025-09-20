import JoinCommunity from "@/components/about/join-community";
import OpenSourceMission from "@/components/about/open-source-mission";
import TeamSection from "@/components/about/team-section";
import WhatYouWillFindSection from "@/components/about/what-you-will-find-section";
import HeroSection from "@/components/ui/hero-section";

export default function AboutPage() {
  return (
    <>
      {/* <div className="relative pt-24 md:pt-28 container mx-auto px-4 py-8 max-w-6xl"> */}

      <div className="container mx-auto px-4 max-w-6xl">
        <HeroSection />
        <OpenSourceMission />
        <WhatYouWillFindSection />
      </div>
      <TeamSection />
      <JoinCommunity />
    </>
  );
}
