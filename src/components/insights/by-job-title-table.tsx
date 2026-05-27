import type { InsightsByJobTitle } from '@/lib/api-contract';

type Props = {
  data: InsightsByJobTitle;
  currency?: string;
};

export function ByJobTitleTable({ data, currency = 'USD' }: Props) {
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
            <td className="py-2 pr-4 text-right tabular-nums">{formatMoney(row.avg, currency)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatMoney(minorUnits: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(minorUnits / 100);
  } catch {
    return `${currency} ${(minorUnits / 100).toLocaleString()}`;
  }
}
