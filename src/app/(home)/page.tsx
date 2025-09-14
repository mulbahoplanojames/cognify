import { auth } from "@/lib/auth";
import React from "react";
import { headers } from "next/headers";
import HomeHeroSection from "@/components/home/home-hero-section";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log(session);

  return (
    <>
      <HomeHeroSection />

      <pre>{JSON.stringify(session, null, 2)}</pre>
    </>
  );
}
