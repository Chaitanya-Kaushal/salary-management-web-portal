'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export type EmployeeFilters = {
  page: number;
  pageSize: number;
  search?: string;
  country?: string;
  department?: string;
  jobTitle?: string;
};

const DEFAULT_PAGE_SIZE = 10;

export function useUrlFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: EmployeeFilters = {
    page: Number(searchParams.get('page')) || 1,
    pageSize: DEFAULT_PAGE_SIZE,
    search: searchParams.get('search') ?? undefined,
    country: searchParams.get('country') ?? undefined,
    department: searchParams.get('department') ?? undefined,
    jobTitle: searchParams.get('jobTitle') ?? undefined,
  };

  const setFilters = (next: Partial<EmployeeFilters>) => {
    const merged: EmployeeFilters = { ...filters, ...next };
    const params = new URLSearchParams();
    if (merged.page > 1) params.set('page', String(merged.page));
    if (merged.search) params.set('search', merged.search);
    if (merged.country) params.set('country', merged.country);
    if (merged.department) params.set('department', merged.department);
    if (merged.jobTitle) params.set('jobTitle', merged.jobTitle);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return { filters, setFilters };
}
