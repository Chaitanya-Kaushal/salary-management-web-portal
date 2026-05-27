import type { InsightsByCountry } from '@/lib/api-contract';

type Props = {
  data: InsightsByCountry;
};

export function ByCountryCards({ data }: Props) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((row) => (
        <article key={row.country} className="rounded border p-4">
          <header className="mb-3 flex items-baseline justify-between">
            <h3 className="text-lg font-semibold">{row.country}</h3>
            <span className="text-xs text-muted-foreground">{row.count} employees</span>
          </header>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <Stat label="Min" value={formatUsd(row.min)} />
            <Stat label="Max" value={formatUsd(row.max)} />
            <Stat label="Avg" value={formatUsd(row.avg)} />
            <Stat label="Median" value={formatUsd(row.median)} />
          </dl>
        </article>
      ))}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

function formatUsd(minorUnits: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(minorUnits / 100);
}
