'use client';

import { useInsightsSummary } from '@/hooks/use-insights-summary';
import { useInsightsByCountry } from '@/hooks/use-insights-by-country';
import { SummaryTiles } from '@/components/insights/summary-tiles';
import { ByCountryCards } from '@/components/insights/by-country-cards';

export default function InsightsPage() {
  const { data: summary } = useInsightsSummary();
  const { data: byCountry } = useInsightsByCountry();

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
    </main>
  );
}
