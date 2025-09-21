import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Eye, TrendingUp, XCircle } from "lucide-react";

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
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Approved Today
              </span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                Pending Review
              </span>
              <span className="font-medium">7</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                Rejected Today
              </span>
              <span className="font-medium">3</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
