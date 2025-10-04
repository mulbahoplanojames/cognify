import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function CTASection() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Join Our Open Source Community
          </h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Learn more, grow faster, and give back—join a community that
            believes knowledge should be free and open for all students and
            learners everywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {!session?.user ? (
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="premium-shadow text-lg px-12 py-4 cursor-pointer"
                >
                  Join Cognify
                </Button>
              </Link>
            ) : (
              <Link href="/write">
                <Button
                  size="lg"
                  className="premium-shadow text-lg px-12 py-4 cursor-pointer"
                >
                  Write a Post
                </Button>
              </Link>
            )}
            <Link href="/write">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-12 py-4 bg-transparent cursor-pointer"
              >
                Request a Feature
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground ">
            Always free • Open source • Community-driven • No hidden costs
          </p>
        </div>
      </div>
    </section>
  );
}
