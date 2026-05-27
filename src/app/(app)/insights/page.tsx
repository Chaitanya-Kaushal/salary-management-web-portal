'use client';

import { useState } from 'react';
import { useInsightsSummary } from '@/hooks/use-insights-summary';
import { useInsightsByCountry } from '@/hooks/use-insights-by-country';
import { useInsightsByJobTitle } from '@/hooks/use-insights-by-job-title';
import { SummaryTiles } from '@/components/insights/summary-tiles';
import { ByCountryCards } from '@/components/insights/by-country-cards';
import { ByJobTitleTable } from '@/components/insights/by-job-title-table';

export default function InsightsPage() {
  const { data: summary } = useInsightsSummary();
  const { data: byCountry } = useInsightsByCountry();
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
  const { data: byJobTitle } = useInsightsByJobTitle(selectedCountry);

  return (
    <main className="space-y-8 p-8">
      <h1 className="text-2xl font-semibold">Insights</h1>

      {summary && <SummaryTiles summary={summary} />}

      {byCountry && byCountry.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Salaries by country
          </h2>
          <ByCountryCards data={byCountry} />
        </section>
      )}

      {byJobTitle && byJobTitle.length > 0 && (
        <section className="space-y-3">
          <header className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Average salary by role
            </h2>
            {byCountry && byCountry.length > 0 && (
              <label className="text-sm">
                <span className="mr-2 text-muted-foreground">Country</span>
                <select
                  value={selectedCountry ?? ''}
                  onChange={(e) => setSelectedCountry(e.target.value || undefined)}
                  className="rounded border px-2 py-1"
                >
                  <option value="">All</option>
                  {byCountry.map((c) => (
                    <option key={c.country} value={c.country}>
                      {c.country}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </header>
          <ByJobTitleTable
            data={byJobTitle}
            currency={byCountry?.find((c) => c.country === selectedCountry)?.currency}
          />
        </section>
      )}
    </main>
  );
}
