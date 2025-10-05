import { FeatureRequestForm } from "@/components/feature-request/feature-request-form";
import HeroSection from "@/components/ui/hero-section";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feature Request",
  description: "Request a feature or share feedback",
};

export default async function FeatureRequestPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        title="Share Your Ideas"
        description="We value your feedback and ideas. Let us know what features you'd like to see in Cognify!"
        postSearch={false}
        tab="Feature Requests"
      />

      {/* Feature Request Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-card rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Request a Feature or Share Feedback
          </h2>
          <p className="text-muted-foreground mb-8">
            Your feedback helps us improve Cognify. Please provide as much
            detail as possible about the feature you&apos;re requesting or the
            feedback you&apos;d like to share.
          </p>

          <FeatureRequestForm />
        </div>
      </section>
    </div>
  );
}
