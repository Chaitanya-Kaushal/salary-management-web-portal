'use client';

import { useState } from 'react';
import { useInsightsSummary } from '@/hooks/use-insights-summary';
import { useInsightsByCountry } from '@/hooks/use-insights-by-country';
import { useInsightsByJobTitle } from '@/hooks/use-insights-by-job-title';
import { useInsightsByDepartment } from '@/hooks/use-insights-by-department';
import { useInsightsByEmploymentType } from '@/hooks/use-insights-by-employment-type';
import { SummaryTiles } from '@/components/insights/summary-tiles';
import { ByCountryCards } from '@/components/insights/by-country-cards';
import { ByJobTitleTable } from '@/components/insights/by-job-title-table';
import { DistributionChart } from '@/components/insights/distribution-chart';
import { HeadcountByDepartment } from '@/components/insights/headcount-by-department';
import { EmploymentTypeBreakdown } from '@/components/insights/employment-type-breakdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function InsightsPage() {
  const { data: summary, isLoading: summaryLoading } = useInsightsSummary();
  const { data: byCountry, isLoading: byCountryLoading } = useInsightsByCountry();
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
  const { data: byJobTitle, isLoading: byJobTitleLoading } = useInsightsByJobTitle(selectedCountry);
  const { data: byDepartment, isLoading: byDepartmentLoading } = useInsightsByDepartment();
  const { data: byEmploymentType, isLoading: byEmploymentTypeLoading } =
    useInsightsByEmploymentType();

  const distributionCountry =
    byCountry?.find((c) => c.country === selectedCountry) ?? byCountry?.[0];

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="mt-1 text-muted-foreground">
          Salary distribution and headcount across the org.
        </p>
      </header>

      {summaryLoading ? <SummaryTilesSkeleton /> : summary && <SummaryTiles summary={summary} />}

      <Card>
        <CardHeader>
          <CardTitle>Salaries by country</CardTitle>
          <CardDescription>Min, max, average and median salary per country.</CardDescription>
        </CardHeader>
        <CardContent>
          {byCountryLoading ? (
            <ByCountryCardsSkeleton />
          ) : byCountry && byCountry.length > 0 ? (
            <ByCountryCards data={byCountry} />
          ) : (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div>
            <CardTitle>Salary distribution</CardTitle>
            <CardDescription>How salaries spread across pay bands.</CardDescription>
          </div>
          {byCountry && byCountry.length > 1 && distributionCountry && (
            <CountrySelect
              value={distributionCountry.country}
              options={byCountry.map((c) => c.country)}
              onChange={setSelectedCountry}
            />
          )}
        </CardHeader>
        <CardContent>
          {byCountryLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : distributionCountry && distributionCountry.bands.length > 0 ? (
            <DistributionChart bands={distributionCountry.bands} />
          ) : (
            <p className="text-sm text-muted-foreground">No distribution data.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Headcount by department</CardTitle>
            <CardDescription>How many employees in each department.</CardDescription>
          </CardHeader>
          <CardContent>
            {byDepartmentLoading ? (
              <ListSkeleton rows={5} />
            ) : byDepartment && byDepartment.length > 0 ? (
              <HeadcountByDepartment data={byDepartment} />
            ) : (
              <p className="text-sm text-muted-foreground">No data.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment type</CardTitle>
            <CardDescription>Workforce composition by employment type.</CardDescription>
          </CardHeader>
          <CardContent>
            {byEmploymentTypeLoading ? (
              <ListSkeleton rows={3} />
            ) : byEmploymentType && byEmploymentType.length > 0 ? (
              <EmploymentTypeBreakdown data={byEmploymentType} />
            ) : (
              <p className="text-sm text-muted-foreground">No data.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div>
            <CardTitle>Average salary by role</CardTitle>
            <CardDescription>Compare pay across job titles, optionally by country.</CardDescription>
          </div>
          {byCountry && byCountry.length > 0 && (
            <CountrySelect
              value={selectedCountry ?? ''}
              options={['', ...byCountry.map((c) => c.country)]}
              onChange={(v) => setSelectedCountry(v || undefined)}
              allLabel="All"
            />
          )}
        </CardHeader>
        <CardContent>
          {byJobTitleLoading ? (
            <ListSkeleton rows={5} />
          ) : byJobTitle && byJobTitle.length > 0 ? (
            <ByJobTitleTable
              data={byJobTitle}
              currency={byCountry?.find((c) => c.country === selectedCountry)?.currency}
            />
          ) : (
            <p className="text-sm text-muted-foreground">No data.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function SummaryTilesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}

function ByCountryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}

function ListSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}

function CountrySelect({
  value,
  options,
  onChange,
  allLabel,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  allLabel?: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Country</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border bg-background px-2 py-1"
      >
        {options.map((opt) => (
          <option key={opt || 'all'} value={opt}>
            {opt === '' ? (allLabel ?? 'All') : opt}
          </option>
        ))}
      </select>
    </label>
  );
}
