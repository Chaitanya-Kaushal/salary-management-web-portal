'use client';

import Link from 'next/link';
import { ArrowRight, Briefcase, Globe2, Sparkles, Users } from 'lucide-react';
import { useMe } from '@/hooks/use-me';
import { useInsightsSummary } from '@/hooks/use-insights-summary';
import { useEmployees } from '@/hooks/use-employees';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" /> HR dashboard
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome back{user ? ',' : ''}{' '}
          {user ? <span className="text-primary">{user.email}</span> : null}
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
        />
        <StatCard
          icon={<Globe2 className="h-5 w-5" />}
          label="Countries"
          value={totalCountries.toString()}
        />
        <StatCard icon={<Globe2 className="h-5 w-5" />} label="Top country" value={topCountry} />
        <StatCard icon={<Briefcase className="h-5 w-5" />} label="Top role" value={topRole} />
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
                {recent.data.map((e) => (
                  <li key={e.id} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="font-medium">{e.fullName}</span>
                    <span className="text-muted-foreground">
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

        <Card>
          <CardHeader>
            <CardTitle>Jump in</CardTitle>
            <CardDescription>Common HR tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <QuickLink href="/employees" label="Manage employees" />
            <QuickLink href="/insights" label="View insights" />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 pt-6">
        <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-0.5 text-2xl font-semibold tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-muted"
    >
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
