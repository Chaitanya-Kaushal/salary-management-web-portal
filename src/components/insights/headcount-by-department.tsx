import type { InsightsByDepartment } from '@/lib/api-contract';

type Props = {
  data: InsightsByDepartment;
};

export function HeadcountByDepartment({ data }: Props) {
  const maxCount = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="space-y-2">
      {data.map((row) => {
        const pct = Math.round((row.count / maxCount) * 100);
        return (
          <div key={row.department} className="grid grid-cols-[10rem_1fr_3rem] items-center gap-3">
            <span className="truncate text-sm font-medium">{row.department}</span>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-right text-sm tabular-nums">{row.count}</span>
          </div>
        );
      })}
    </div>
  );
}
