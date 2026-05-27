'use client';

import { useInsightsSummary } from '@/hooks/use-insights-summary';
import { SummaryTiles } from '@/components/insights/summary-tiles';

export default function InsightsPage() {
  const { data } = useInsightsSummary();

  return (
    <main className="p-8">
      <h1 className="mb-6 text-2xl font-semibold">Insights</h1>
      {data && <SummaryTiles summary={data} />}
    </main>
  );
}
