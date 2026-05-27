import { Briefcase, Globe, Globe2, Users } from 'lucide-react';
import type { InsightsSummary } from '@/lib/api-contract';

type Props = {
  summary: InsightsSummary;
};

export function SummaryTiles({ summary }: Props) {
  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Tile
        icon={<Users className="h-5 w-5" />}
        label="Total employees"
        value={summary.totalEmployees.toLocaleString()}
        color="var(--chart-1)"
      />
      <Tile
        icon={<Globe className="h-5 w-5" />}
        label="Countries"
        value={summary.topCountries.length.toString()}
        color="var(--chart-2)"
      />
      <Tile
        icon={<Globe2 className="h-5 w-5" />}
        label="Top country"
        value={summary.topCountries[0]?.country ?? '—'}
        color="var(--chart-3)"
      />
      <Tile
        icon={<Briefcase className="h-5 w-5" />}
        label="Top role"
        value={summary.topJobTitles[0]?.jobTitle ?? '—'}
        color="var(--chart-5)"
      />
    </section>
  );
}

function Tile({
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
    <div className="flex items-start gap-3 rounded-lg border bg-card p-4 shadow-sm">
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
    </div>
  );
}
