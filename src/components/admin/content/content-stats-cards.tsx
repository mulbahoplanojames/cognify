import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, Clock, Flag, CheckCircle } from "lucide-react";

const contentStats = [
  {
    title: "Total Posts",
    value: 1234,
    icon: <Eye className="h-4 w-4 text-muted-foreground" />,
    change: "+12% from last month",
  },
  {
    title: "Pending Review",
    value: 23,
    icon: <Clock className="h-4 w-4 text-muted-foreground" />,
    change: "-5 from yesterday",
  },
  {
    title: "Flagged Content",
    value: 7,
    icon: <Flag className="h-4 w-4 text-muted-foreground" />,
    change: "+2 from yesterday",
  },
  {
    title: "Published Today",
    value: 15,
    icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
    change: "+3 from yesterday",
  },
];

export default function ContentStatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-4 grid-cols-2">
      {contentStats.map((stat) => (
        <Card className="py-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
