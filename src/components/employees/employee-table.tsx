import type { Employee } from '@/lib/api-contract';

type Props = {
  employees: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
};

export function EmployeeTable({ employees, onEdit, onDelete }: Props) {
  const showActions = Boolean(onEdit || onDelete);

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
          <th className="py-2 pr-4">Name</th>
          <th className="py-2 pr-4">Job title</th>
          <th className="py-2 pr-4">Department</th>
          <th className="py-2 pr-4">Country</th>
          <th className="py-2 pr-4 text-right">Salary</th>
          {showActions && <th className="py-2 pr-4" />}
        </tr>
      </thead>
      <tbody>
        {employees.map((e) => (
          <tr key={e.id} className="border-b">
            <td className="py-2 pr-4 font-medium">{e.fullName}</td>
            <td className="py-2 pr-4">{e.jobTitle}</td>
            <td className="py-2 pr-4">{e.department}</td>
            <td className="py-2 pr-4">{e.country}</td>
            <td className="py-2 pr-4 text-right tabular-nums">
              {formatSalary(e.salary, e.currency)}
            </td>
            {showActions && (
              <td className="py-2 pr-4">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <button
                      type="button"
                      aria-label={`Edit ${e.fullName}`}
                      onClick={() => onEdit(e)}
                      className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      aria-label={`Delete ${e.fullName}`}
                      onClick={() => onDelete(e)}
                      className="text-xs text-destructive underline-offset-4 hover:underline"
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
