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
      />
      <Tile
        icon={<Globe className="h-5 w-5" />}
        label="Countries"
        value={summary.topCountries.length.toString()}
      />
      <Tile
        icon={<Globe2 className="h-5 w-5" />}
        label="Top country"
        value={summary.topCountries[0]?.country ?? '—'}
      />
      <Tile
        icon={<Briefcase className="h-5 w-5" />}
        label="Top role"
        value={summary.topJobTitles[0]?.jobTitle ?? '—'}
      />
    </section>
  );
}

function Tile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-4 shadow-sm">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-2xl font-semibold tabular-nums">{value}</p>
      </div>
    </div>
  );
}
