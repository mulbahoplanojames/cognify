import { BookOpen, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const premiumContent = [
  {
    title: "Expert-Led Masterclasses",
    description:
      "Deep-dive sessions with industry leaders and innovators - completely free",
  },
  {
    title: "Student-Focused Resources",
    description:
      "Comprehensive learning materials designed for academic success",
  },
  {
    title: "Interactive Workshops",
    description: "Hands-on learning with immediate practical application",
  },
  {
    title: "Open Certification Programs",
    description: "Industry-recognized credentials accessible to everyone",
  },
];

const advancedFeatures = [
  {
    title: "AI-Powered Recommendations",
    description: "Personalized content curation based on your learning goals",
  },
  {
    title: "Global Expert Community",
    description: "Connect with thought leaders and peers worldwide",
  },
  {
    title: "Learning Analytics",
    description: "Track your progress and skill development",
  },
  {
    title: "Mobile-First Experience",
    description: "Learn anywhere with our responsive platform",
  },
];

export default function WhatYouWillFindSection() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:py-20 py-16">
      <Card className="premium-shadow border-0">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-500" />
            Free Premium Content Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {premiumContent.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <Star className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="premium-shadow border-0">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-green-500" />
            Advanced Features (All Free)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {advancedFeatures.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <Star className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
