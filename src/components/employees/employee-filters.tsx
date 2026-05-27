type Props = {
  country?: string;
  department?: string;
  jobTitle?: string;
  onChange: (next: { country?: string; department?: string; jobTitle?: string }) => void;
};

const COUNTRIES = ['US', 'UK', 'IN', 'DE', 'FR', 'CA', 'AU', 'JP', 'BR', 'SG'];
const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Sales', 'Marketing', 'Operations'];
const JOB_TITLES = ['Engineer', 'Manager', 'Designer', 'Analyst', 'Director'];

export function EmployeeFilters({ country, department, jobTitle, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-2 text-sm">
        <span className="sr-only">Country</span>
        <select
          id="country"
          value={country ?? ''}
          onChange={(e) => onChange({ country: e.target.value || undefined })}
          className="rounded border px-2 py-2"
        >
          <option value="">All countries</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <span className="sr-only">Department</span>
        <select
          id="department"
          value={department ?? ''}
          onChange={(e) => onChange({ department: e.target.value || undefined })}
          className="rounded border px-2 py-2"
        >
          <option value="">All departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <span className="sr-only">Job title</span>
        <select
          id="jobTitle"
          value={jobTitle ?? ''}
          onChange={(e) => onChange({ jobTitle: e.target.value || undefined })}
          className="rounded border px-2 py-2"
        >
          <option value="">All titles</option>
          {JOB_TITLES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
