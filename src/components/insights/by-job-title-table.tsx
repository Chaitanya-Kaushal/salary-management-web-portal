import type { InsightsByJobTitle } from '@/lib/api-contract';

type Props = {
  data: InsightsByJobTitle;
  currency?: string;
};

export function ByJobTitleTable({ data, currency = 'USD' }: Props) {
  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <table className="w-full min-w-120 text-left text-sm">
        <thead>
          <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
            <th className="py-2 pr-4 pl-4 sm:pl-0">Job title</th>
            <th className="py-2 pr-4 text-right">Headcount</th>
            <th className="py-2 pr-4 text-right">Avg salary</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.jobTitle} className="border-b">
              <td className="py-2 pr-4 pl-4 font-medium sm:pl-0">{row.jobTitle}</td>
              <td className="py-2 pr-4 text-right tabular-nums">{row.count}</td>
              <td className="py-2 pr-4 text-right tabular-nums">
                {formatMoney(row.avg, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
