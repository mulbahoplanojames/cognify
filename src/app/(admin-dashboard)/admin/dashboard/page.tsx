import ContentOverview from "@/components/admin/dashboard/content-overiew";
import KpiCard from "@/components/admin/dashboard/kpi-card";
import QuickMetrics from "@/components/admin/dashboard/quick-metrics";
import { kpiCards } from "@/data/admin/admin";
export default function AdminDashboardPage() {
  return (
    <>
      <section className="">
        <div>
          <h1 className="text-3xl font-bold">Admin Overview</h1>
          <p className="text-muted-foreground">
            Monitor your platform&apos;s performance and manage operations
          </p>
        </div>
        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 grid-cols-2 lg:grid-cols-4 mt-8">
          {kpiCards.map((kpi) => (
            <KpiCard key={kpi.title} kpi={kpi} />
          ))}
        </div>
      </section>
      <QuickMetrics />
      <ContentOverview />
    </>
  );
}
