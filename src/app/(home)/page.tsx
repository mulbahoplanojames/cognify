import HomeHeroSection from "@/components/home/home-hero-section";
import OurMissionSection from "@/components/home/our-mission";
import WhyChooseUsSection from "@/components/home/why-choose-us-section";
import PremiumLibraryContentSection from "@/components/home/premium-library-content";
import CTASection from "@/components/home/cta-section";

export default async function HomePage() {
  return (
    <>
      <HomeHeroSection />
      <OurMissionSection />
      <PremiumLibraryContentSection />
      <WhyChooseUsSection />
      <CTASection />
    </>
  );
}
