import type { Employee } from '@/lib/api-contract';

type Props = {
  employees: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
};

const AVATAR_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

function pickColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function EmployeeTable({ employees, onEdit, onDelete }: Props) {
  const showActions = Boolean(onEdit || onDelete);

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
          <th className="py-3 pr-4">Name</th>
          <th className="py-3 pr-4">Job title</th>
          <th className="py-3 pr-4">Department</th>
          <th className="py-3 pr-4">Country</th>
          <th className="py-3 pr-4 text-right">Salary</th>
          {showActions && <th className="py-3 pr-4" />}
        </tr>
      </thead>
      <tbody>
        {employees.map((e) => (
          <tr key={e.id} className="border-b transition-colors hover:bg-accent/30">
            <td className="py-2.5 pr-4">
              <div className="flex items-center gap-3">
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold uppercase text-white shadow-sm"
                  style={{ background: pickColor(e.id) }}
                  aria-hidden
                >
                  {e.fullName[0]}
                </span>
                <span className="font-medium">{e.fullName}</span>
              </div>
            </td>
            <td className="py-2.5 pr-4 text-muted-foreground">{e.jobTitle}</td>
            <td className="py-2.5 pr-4 text-muted-foreground">{e.department}</td>
            <td className="py-2.5 pr-4">
              <span className="inline-flex items-center rounded-md bg-accent/60 px-2 py-0.5 text-xs font-medium text-accent-foreground">
                {e.country}
              </span>
            </td>
            <td className="py-2.5 pr-4 text-right font-semibold tabular-nums text-primary">
              {formatSalary(e.salary, e.currency)}
            </td>
            {showActions && (
              <td className="py-2.5 pr-4">
                <div className="flex justify-end gap-3">
                  {onEdit && (
                    <button
                      type="button"
                      aria-label={`Edit ${e.fullName}`}
                      onClick={() => onEdit(e)}
                      className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      aria-label={`Delete ${e.fullName}`}
                      onClick={() => onDelete(e)}
                      className="text-xs font-medium text-destructive underline-offset-4 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatSalary(minorUnits: number, currency: string): string {
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
