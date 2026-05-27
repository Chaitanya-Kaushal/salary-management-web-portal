type Band = {
  label: string;
  count: number;
};

type Props = {
  bands: Band[];
};

export function DistributionChart({ bands }: Props) {
  const maxCount = Math.max(1, ...bands.map((b) => b.count));

  return (
    <div className="space-y-2">
      {bands.map((band) => {
        const pct = Math.round((band.count / maxCount) * 100);
        return (
          <div key={band.label} className="grid grid-cols-[6rem_1fr_3rem] items-center gap-3">
            <span className="text-xs text-muted-foreground">{band.label}</span>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-right text-xs tabular-nums">{band.count}</span>
          </div>
        );
      })}
    </div>
  );
}
