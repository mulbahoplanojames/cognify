import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Github, Twitter } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function JoinCommunity() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 container mx-auto px-4 max-w-6xl py-20">
      <Card className="premium-shadow border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Join Our Community</CardTitle>
          <CardDescription>
            Connect with our global community of learners and innovators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <Button asChild className="justify-start h-12">
              <Link
                href="mailto:mulbahjamesoplano@gmail.com"
                className="flex items-center gap-3"
              >
                <Mail className="h-5 w-5" />
                mulbahjamesoplano@gmail.com
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="justify-start h-12 bg-transparent"
            >
              <Link
                href="https://github.com/mulbahoplanojames/cognify"
                target="_blank"
                className="flex items-center gap-3"
              >
                <Github className="h-5 w-5" />
                Contribute on GitHub
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="justify-start h-12 bg-transparent"
            >
              <Link
                href="https://twitter.com/mulbahoplanojames"
                target="_blank"
                className="flex items-center gap-3"
              >
                <Twitter className="h-5 w-5" />
                Connect on Twitter
              </Link>
            </Button>
          </div>

          <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
            <p className="text-sm text-muted-foreground">
              <strong>Open Source Contributors:</strong> Join our mission to
              democratize education. Visit our GitHub repository to contribute
              code, content, or ideas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
