'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  department: z.string().min(1, 'Department is required'),
  country: z.string().min(2, 'Country is required').max(2),
  currency: z.string().min(3, 'Currency is required').max(3),
  salary: z.coerce.number().int().min(1, 'Salary is required'),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACTOR']),
  hireDate: z.string().min(1, 'Hire date is required'),
});

export type EmployeeFormValues = z.infer<typeof schema>;

type Props = {
  defaultValues?: Partial<EmployeeFormValues>;
  submitLabel: string;
  onSubmit: (values: EmployeeFormValues) => void;
  isPending?: boolean;
};

export function EmployeeForm({ defaultValues, submitLabel, onSubmit, isPending }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { employmentType: 'FULL_TIME', ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field id="fullName" label="Full name" error={errors.fullName?.message}>
          <input id="fullName" {...register('fullName')} className={inputCls} />
        </Field>

        <Field id="email" label="Email" error={errors.email?.message}>
          <input id="email" type="email" {...register('email')} className={inputCls} />
        </Field>

        <Field id="jobTitle" label="Job title" error={errors.jobTitle?.message}>
          <input id="jobTitle" {...register('jobTitle')} className={inputCls} />
        </Field>

        <Field id="department" label="Department" error={errors.department?.message}>
          <input id="department" {...register('department')} className={inputCls} />
        </Field>

        <Field id="countryCode" label="Country code" error={errors.country?.message}>
          <input
            id="countryCode"
            maxLength={2}
            placeholder="US"
            {...register('country')}
            className={inputCls}
          />
        </Field>

        <Field id="currency" label="Currency code" error={errors.currency?.message}>
          <input
            id="currency"
            maxLength={3}
            placeholder="USD"
            {...register('currency')}
            className={inputCls}
          />
        </Field>

        <Field id="salary" label="Salary (in minor units)" error={errors.salary?.message}>
          <input id="salary" type="number" {...register('salary')} className={inputCls} />
        </Field>

        <Field id="hireDate" label="Hire date" error={errors.hireDate?.message}>
          <input id="hireDate" type="date" {...register('hireDate')} className={inputCls} />
        </Field>

        <Field id="employmentType" label="Employment type" error={errors.employmentType?.message}>
          <select id="employmentType" {...register('employmentType')} className={inputCls}>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACTOR">Contractor</option>
          </select>
        </Field>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-foreground px-4 py-2 text-sm text-background disabled:opacity-60"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

const inputCls = 'w-full rounded border px-3 py-2 text-sm';

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
