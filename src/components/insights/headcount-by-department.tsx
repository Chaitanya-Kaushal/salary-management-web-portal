'use client';

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { InsightsByDepartment } from '@/lib/api-contract';

type Props = {
  data: InsightsByDepartment;
};

const COLOR_VARS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export function HeadcountByDepartment({ data }: Props) {
  const chartData = data.map((row) => ({ name: row.department, count: row.count }));

  return (
    <div className="space-y-3">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--muted)' }}
              contentStyle={{
                background: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                color: 'var(--popover-foreground)',
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLOR_VARS[index % COLOR_VARS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {data.map((row, index) => (
          <li key={row.department} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: COLOR_VARS[index % COLOR_VARS.length] }}
            />
            <span className="text-foreground">{row.department}</span>
            <span className="tabular-nums">· {row.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
