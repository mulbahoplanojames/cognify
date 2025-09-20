import JoinCommunity from "@/components/about/join-community";
import OpenSourceMission from "@/components/about/open-source-mission";
import TeamSection from "@/components/about/team-section";
import WhatYouWillFindSection from "@/components/about/what-you-will-find-section";
import HeroSection from "@/components/ui/hero-section";

export default function AboutPage() {
  return (
    <>
      <div className="container mx-auto px-4 max-w-6xl">
        <HeroSection
          title="About Cognify"
          description="Cognify is your go-to open-source learning hub, loved by students, creators, and learners everywhere. Always free, always open—because knowledge belongs to all of us."
          tab="100% Free & Open Source Platform"
        />
        <OpenSourceMission />
        <WhatYouWillFindSection />
      </div>
      <TeamSection />
      <JoinCommunity />
    </>
  );
}
