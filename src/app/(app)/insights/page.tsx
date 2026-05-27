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

export default function InsightsPage() {
  const { data: summary } = useInsightsSummary();
  const { data: byCountry } = useInsightsByCountry();
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
  const { data: byJobTitle } = useInsightsByJobTitle(selectedCountry);
  const { data: byDepartment } = useInsightsByDepartment();
  const { data: byEmploymentType } = useInsightsByEmploymentType();

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

      {summary && <SummaryTiles summary={summary} />}

      {byCountry && byCountry.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Salaries by country</CardTitle>
            <CardDescription>Min, max, average and median salary per country.</CardDescription>
          </CardHeader>
          <CardContent>
            <ByCountryCards data={byCountry} />
          </CardContent>
        </Card>
      )}

      {distributionCountry && distributionCountry.bands.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle>Salary distribution</CardTitle>
              <CardDescription>How salaries spread across pay bands.</CardDescription>
            </div>
            {byCountry && byCountry.length > 1 && (
              <CountrySelect
                value={distributionCountry.country}
                options={byCountry.map((c) => c.country)}
                onChange={setSelectedCountry}
              />
            )}
          </CardHeader>
          <CardContent>
            <DistributionChart bands={distributionCountry.bands} />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {byDepartment && byDepartment.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Headcount by department</CardTitle>
              <CardDescription>How many employees in each department.</CardDescription>
            </CardHeader>
            <CardContent>
              <HeadcountByDepartment data={byDepartment} />
            </CardContent>
          </Card>
        )}

        {byEmploymentType && byEmploymentType.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Employment type</CardTitle>
              <CardDescription>Workforce composition by employment type.</CardDescription>
            </CardHeader>
            <CardContent>
              <EmploymentTypeBreakdown data={byEmploymentType} />
            </CardContent>
          </Card>
        )}
      </div>

      {byJobTitle && byJobTitle.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle>Average salary by role</CardTitle>
              <CardDescription>
                Compare pay across job titles, optionally by country.
              </CardDescription>
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
            <ByJobTitleTable
              data={byJobTitle}
              currency={byCountry?.find((c) => c.country === selectedCountry)?.currency}
            />
          </CardContent>
        </Card>
      )}
    </main>
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
