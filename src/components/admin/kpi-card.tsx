import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { kpiCardsType } from "@/types/admin";

export default function KpiCard({ kpi }: { kpi: kpiCardsType }) {
  return (
    <Card key={kpi.title} className="py-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
        <kpi.icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="">
        <div className="text-2xl font-bold">{kpi.value.toLocaleString()}</div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`flex items-center gap-1 ${
              kpi.changeType === "positive" ? "text-green-600" : "text-red-600"
            }`}
          >
            {kpi.changeType === "positive" ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {kpi.change}
          </span>
          <span className="text-muted-foreground">{kpi.description}</span>
        </div>
      </CardContent>
    </Card>
  );
}
