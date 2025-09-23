import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contentPerformance, moderationQueue } from "@/data/admin/admin";
import { CheckCircle, Eye, TrendingUp } from "lucide-react";

export default function ContentOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-2 mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Content Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contentPerformance.map((contentPerformance) => {
            return (
              <div className="flex justify-between items-center space-y-4">
                <span className="text-sm">{contentPerformance.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm flex items-center gap-2">
                    {contentPerformance.title === "Engagement Rate" && (
                      <CheckCircle className="h-4 w-4 " />
                    )}
                  </span>

                  <span className="font-medium">
                    {contentPerformance.value}
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Moderation Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moderationQueue.map((moderationQueue) => {
              return (
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-2">
                    <moderationQueue.icon
                      className={`h-4 w-4 text-${moderationQueue.color}`}
                    />
                    {moderationQueue.title}
                  </span>
                  <span className="font-medium">{moderationQueue.value}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
