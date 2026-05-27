'use client';

import Link from 'next/link';
import { ArrowRight, Briefcase, Globe2, Sparkles, Users } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useMe } from '@/hooks/use-me';
import { useInsightsSummary } from '@/hooks/use-insights-summary';
import { useEmployees } from '@/hooks/use-employees';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export default function HomePage() {
  const { data: user } = useMe();
  const { data: summary } = useInsightsSummary();
  const { data: recent } = useEmployees({ page: 1, pageSize: 5 });

  const topCountry = summary?.topCountries[0]?.country ?? '—';
  const topRole = summary?.topJobTitles[0]?.jobTitle ?? '—';
  const totalCountries = summary?.topCountries.length ?? 0;

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" /> HR dashboard
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight wrap-break-word sm:text-3xl lg:text-4xl">
          Welcome back{user ? ',' : ''}{' '}
          {user ? <span className="text-primary">{user.name ?? user.email}</span> : null}
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          A quick look at your organisation. Browse employees or dive into the salary insights.
        </p>
      </section>

      <section className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Total employees"
          value={(summary?.totalEmployees ?? 0).toLocaleString()}
          color="var(--chart-1)"
        />
        <StatCard
          icon={<Globe2 className="h-5 w-5" />}
          label="Countries"
          value={totalCountries.toString()}
          color="var(--chart-2)"
        />
        <StatCard
          icon={<Globe2 className="h-5 w-5" />}
          label="Top country"
          value={topCountry}
          color="var(--chart-3)"
        />
        <StatCard
          icon={<Briefcase className="h-5 w-5" />}
          label="Top role"
          value={topRole}
          color="var(--chart-5)"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent additions</CardTitle>
            <CardDescription>Latest employees added to your organisation</CardDescription>
          </CardHeader>
          <CardContent>
            {recent && recent.data.length > 0 ? (
              <ul className="divide-y">
                {recent.data.map((e, i) => (
                  <li key={e.id} className="flex items-center gap-3 py-2.5 text-sm">
                    <span
                      className="grid h-8 w-8 place-items-center rounded-full text-xs font-semibold uppercase text-white"
                      style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                    >
                      {e.fullName[0]}
                    </span>
                    <span className="font-medium">{e.fullName}</span>
                    <span className="ml-auto text-muted-foreground">
                      {e.jobTitle} · {e.country}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">No employees yet.</p>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          {summary && summary.topCountries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Where employees are</CardTitle>
                <CardDescription>Top countries by headcount</CardDescription>
              </CardHeader>
              <CardContent>
                <CountriesMiniChart data={summary.topCountries.slice(0, 5)} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Jump in</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <QuickLink href="/employees" label="Manage employees" />
              <QuickLink href="/insights" label="View insights" />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-start gap-3 pt-6">
        <span
          className="grid h-10 w-10 place-items-center rounded-lg text-white shadow-sm"
          style={{ background: color }}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-0.5 truncate text-2xl font-semibold tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}

function CountriesMiniChart({ data }: { data: { country: string; count: number }[] }) {
  return (
    <div className="space-y-3">
      <div className="h-36 w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="country"
              innerRadius={30}
              outerRadius={60}
              paddingAngle={2}
              strokeWidth={2}
              stroke="var(--card)"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                color: 'var(--popover-foreground)',
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-1.5 text-xs">
        {data.map((row, i) => (
          <li key={row.country} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span className="font-medium">{row.country}</span>
            <span className="ml-auto tabular-nums text-muted-foreground">{row.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
