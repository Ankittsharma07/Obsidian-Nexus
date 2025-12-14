import { Suspense } from "react";
import { accountFilterSchema, listAccounts } from "@/lib/filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientTable } from "@/components/clients/client-table";
import { NewClientButton } from "@/components/clients/new-client-button";
import { ClientFilterBar } from "@/components/clients/client-filter-bar";
import { InsightCard } from "@/components/insights/insight-card";
import type { AccountWithMeta } from "@/types";
import { prisma } from "@/lib/prisma";
import { getMockAccounts } from "@/lib/mock-data";

type MetricSnapshot = {
  revenue: { value: string; context: string };
  atRisk: { value: string; context: string };
  insights: { value: string; context: string };
};

export default async function ClientsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const toSingle = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

  const resolvedParams = await searchParams;
  const filters = accountFilterSchema.parse({
    search: toSingle(resolvedParams.search) ?? "",
    status: toSingle(resolvedParams.status) ?? "ALL",
    page: toSingle(resolvedParams.page) ?? "1"
  });

  const [data, metrics] = await Promise.all([listAccounts(filters), getClientMetrics()]);
  const accounts = data.items as AccountWithMeta[];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-purple-300">Portfolio</p>
          <h1 className="text-3xl font-semibold text-white">Client Intelligence</h1>
          <p className="text-sm text-slate-400">Advanced search, RBAC aware CRUD, and AI summaries.</p>
        </div>
        <NewClientButton />
      </div>

      <ClientFilterBar />

      <section className="grid gap-6 md:grid-cols-3">
        <MetricCard title="Managed Revenue" value={metrics.revenue.value} change={metrics.revenue.context} />
        <MetricCard title="At Risk Accounts" value={metrics.atRisk.value} change={metrics.atRisk.context} />
        <MetricCard title="AI Insights Generated" value={metrics.insights.value} change={metrics.insights.context} />
      </section>

      <Suspense fallback={<p className="text-slate-400">Loading clients…</p>}>
        <ClientTable accounts={accounts} />
      </Suspense>

      <section className="grid gap-4 md:grid-cols-2">
        <InsightCard
          title="Enterprise AI Uplift"
          summary="Precision Labs increased their health score by 12% after we automated governance dashboards. Double down on workflow orchestration."
        />
        <InsightCard
          title="At-risk Recovery Plan"
          summary="Charcoal Analytics flagged a 30% drop in active seats. Recommend executive business review and bundling success services."
          type="Playbook"
        />
      </section>
    </div>
  );
}

function MetricCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <Card className="bg-slate-900/70">
      <CardHeader className="space-y-1">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{title}</p>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-emerald-300">{change}</CardContent>
    </Card>
  );
}

function formatCurrency(amount: number) {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `$${amount.toLocaleString()}`;
}

async function getClientMetrics(): Promise<MetricSnapshot> {
  if (!process.env.DATABASE_URL) {
    const accounts = getMockAccounts();
    const activeAccounts = accounts.filter((acct) => acct.status !== "ARCHIVED");
    const totalRevenue = activeAccounts.reduce((sum, account) => sum + account.annualRevenue, 0);
    const activeCount = activeAccounts.length;
    const atRiskCount = activeAccounts.filter((acct) => acct.status === "AT_RISK").length;
    const insightCount = activeAccounts.reduce((sum, acct) => sum + (acct.interactions?.length ?? 0), 0);
    const openTasks = activeAccounts.reduce(
      (sum, acct) => sum + (acct.tasks?.filter((task) => task.status !== "DONE").length ?? 0),
      0
    );
    return {
      revenue: { value: formatCurrency(totalRevenue), context: `${activeCount} active accounts` },
      atRisk: {
        value: atRiskCount.toString(),
        context: `${activeCount ? ((atRiskCount / activeCount) * 100).toFixed(1) : "0"}% of portfolio`
      },
      insights: { value: insightCount.toString(), context: `${openTasks} open tasks` }
    };
  }

  const [revenueAgg, activeCount, atRiskCount, insightCount, openTasks] = await Promise.all([
    prisma.account.aggregate({ _sum: { annualRevenue: true }, where: { status: { not: "ARCHIVED" } } }),
    prisma.account.count({ where: { status: { not: "ARCHIVED" } } }),
    prisma.account.count({ where: { status: "AT_RISK" } }),
    prisma.insight.count({ where: { account: { status: { not: "ARCHIVED" } } } }),
    prisma.task.count({ where: { status: { not: "COMPLETED" }, account: { status: { not: "ARCHIVED" } } } })
  ]);

  const totalRevenue = revenueAgg._sum.annualRevenue ?? 0;
  return {
    revenue: { value: formatCurrency(totalRevenue), context: `${activeCount} active accounts` },
    atRisk: {
      value: atRiskCount.toString(),
      context: `${activeCount ? ((atRiskCount / activeCount) * 100).toFixed(1) : "0"}% of portfolio`
    },
    insights: { value: insightCount.toString(), context: `${openTasks} open tasks` }
  };
}




