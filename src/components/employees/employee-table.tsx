import type { Employee } from '@/lib/api-contract';

type Props = {
  employees: Employee[];
};

export function EmployeeTable({ employees }: Props) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
          <th className="py-2 pr-4">Name</th>
          <th className="py-2 pr-4">Job title</th>
          <th className="py-2 pr-4">Department</th>
          <th className="py-2 pr-4">Country</th>
          <th className="py-2 pr-4 text-right">Salary</th>
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
