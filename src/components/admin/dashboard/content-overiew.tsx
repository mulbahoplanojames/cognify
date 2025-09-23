import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { moderationQueue } from "@/data/admin/admin";
import { CheckCircle, Clock, Eye, TrendingUp, XCircle } from "lucide-react";
import { color } from "motion/react";

export default function ContentOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-2 mt-4">
      {/* Todo: Replace with actual data in future updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Content Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Posts This Week</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Average Views</span>
              <span className="font-medium">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Engagement Rate
              </span>
              <span className="font-medium text-green-600">8.3%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Todo: Replace with actual data in future updates */}
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
