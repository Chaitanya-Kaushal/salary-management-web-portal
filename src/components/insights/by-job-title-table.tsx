import type { InsightsByJobTitle } from '@/lib/api-contract';

type Props = {
  data: InsightsByJobTitle;
};

export function ByJobTitleTable({ data }: Props) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
          <th className="py-2 pr-4">Job title</th>
          <th className="py-2 pr-4 text-right">Headcount</th>
          <th className="py-2 pr-4 text-right">Avg salary</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.jobTitle} className="border-b">
            <td className="py-2 pr-4 font-medium">{row.jobTitle}</td>
            <td className="py-2 pr-4 text-right tabular-nums">{row.count}</td>
            <td className="py-2 pr-4 text-right tabular-nums">{formatUsd(row.avg)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatUsd(minorUnits: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(minorUnits / 100);
}
