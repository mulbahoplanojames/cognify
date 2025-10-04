import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/20 py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-gradient">
              Cognify Blog
            </h3>
            <p className="text-muted-foreground mb-4">
              The premium platform for professionals who demand excellence in
              content and community.
            </p>
            <div className="flex gap-2">
              <Badge variant="outline">Premium</Badge>
              <Badge variant="outline">Trusted</Badge>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="/feature-request"
                  className="hover:text-primary transition-colors"
                >
                  Feature Requests
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Enterprise
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Cognify Blog. Premium content
            platform built for excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}
