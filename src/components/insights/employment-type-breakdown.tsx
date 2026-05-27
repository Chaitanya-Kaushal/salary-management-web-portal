import type { EmploymentType, InsightsByEmploymentType } from '@/lib/api-contract';

type Props = {
  data: InsightsByEmploymentType;
};

const LABEL: Record<EmploymentType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACTOR: 'Contractor',
};

export function EmploymentTypeBreakdown({ data }: Props) {
  const total = Math.max(
    1,
    data.reduce((sum, row) => sum + row.count, 0),
  );

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {data.map((row) => {
        const pct = Math.round((row.count / total) * 100);
        return (
          <div key={row.employmentType} className="rounded-lg border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {LABEL[row.employmentType]}
            </p>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-semibold tabular-nums">{row.count}</span>
              <span className="text-xs text-muted-foreground">{pct}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
