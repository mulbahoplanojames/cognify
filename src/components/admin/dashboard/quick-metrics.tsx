import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  Clock,
  FileText,
  UserPlus,
  Settings,
  Users,
  MessageCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { quickActions, recentActivity } from "@/data/admin/admin";
import Link from "next/link";

export default function QuickMetrics() {
  return (
    <div className="grid gap-6 lg:grid-cols-3 mt-4">
      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Server Performance</span>
              <span className="text-green-600">98%</span>
            </div>
            <Progress value={98} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Database Health</span>
              <span className="text-green-600">95%</span>
            </div>
            <Progress value={95} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Storage Usage</span>
              <span className="text-yellow-600">72%</span>
            </div>
            <Progress value={72} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={`p-1 rounded-full ${
                    activity.type === "user"
                      ? "bg-blue-100 text-blue-600"
                      : activity.type === "content"
                      ? "bg-green-100 text-green-600"
                      : activity.type === "report"
                      ? "bg-red-100 text-red-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {activity.type === "user" && <UserPlus className="h-3 w-3" />}
                  {activity.type === "content" && (
                    <FileText className="h-3 w-3" />
                  )}
                  {activity.type === "report" && (
                    <AlertTriangle className="h-3 w-3" />
                  )}
                  {activity.type === "admin" && <Users className="h-3 w-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 flex-col flex gap-y-2 ">
          {quickActions.map((action, index) => (
            <Link href={action.href} key={index}>
              <Button
                key={index}
                className="w-full justify-start bg-transparent cursor-pointer"
                variant="outline"
              >
                <action.icon className="size-4 mr-2" />
                {action.title}
              </Button>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
