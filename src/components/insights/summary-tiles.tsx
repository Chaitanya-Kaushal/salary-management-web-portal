import type { InsightsSummary } from '@/lib/api-contract';

type Props = {
  summary: InsightsSummary;
};

export function SummaryTiles({ summary }: Props) {
  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Tile label="Total employees" value={summary.totalEmployees.toLocaleString()} />
      <Tile label="Total payroll" value={formatCurrency(summary.totalPayroll)} />
      <Tile label="Top country" value={summary.topCountries[0]?.country ?? '—'} />
      <Tile label="Top role" value={summary.topJobTitles[0]?.jobTitle ?? '—'} />
    </section>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function formatCurrency(minorUnits: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(minorUnits / 100);
}
