'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { EmploymentType, InsightsByEmploymentType } from '@/lib/api-contract';

type Props = {
  data: InsightsByEmploymentType;
};

const LABEL: Record<EmploymentType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACTOR: 'Contractor',
};

const COLOR_VARS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'];

export function EmploymentTypeBreakdown({ data }: Props) {
  const total = Math.max(
    1,
    data.reduce((sum, row) => sum + row.count, 0),
  );

  const chartData = data.map((row) => ({
    name: LABEL[row.employmentType],
    value: row.count,
  }));

  return (
    <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto]">
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={2}
              strokeWidth={2}
              stroke="var(--card)"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLOR_VARS[index % COLOR_VARS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                color: 'var(--popover-foreground)',
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-2 text-sm">
        {data.map((row, index) => {
          const pct = Math.round((row.count / total) * 100);
          return (
            <li key={row.employmentType} className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: COLOR_VARS[index % COLOR_VARS.length] }}
              />
              <span className="flex-1">{LABEL[row.employmentType]}</span>
              <span className="tabular-nums text-muted-foreground">
                {row.count} <span className="text-xs">· {pct}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
