import { http, HttpResponse } from 'msw';
import { devStore } from './dev-data';
import type {
  Employee,
  EmploymentType,
  InsightsByCountry,
  InsightsByJobTitle,
  InsightsSummary,
} from '@/lib/api-contract';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type EmployeeInput = {
  fullName: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  currency: string;
  salary: number;
  employmentType: EmploymentType;
  hireDate: string;
};

function paginate(items: Employee[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

function applyFilters(items: Employee[], url: URL): Employee[] {
  const search = url.searchParams.get('search')?.toLowerCase();
  const country = url.searchParams.get('country');
  const department = url.searchParams.get('department');
  const jobTitle = url.searchParams.get('jobTitle');

  return items.filter((e) => {
    if (
      search &&
      !e.fullName.toLowerCase().includes(search) &&
      !e.email.toLowerCase().includes(search)
    ) {
      return false;
    }
    if (country && e.country !== country) return false;
    if (department && e.department !== department) return false;
    if (jobTitle && e.jobTitle !== jobTitle) return false;
    return true;
  });
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}

export const devHandlers = [
  http.post(`${API_BASE}/auth/login`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${API_BASE}/auth/logout`, () => new HttpResponse(null, { status: 204 })),
  http.get(`${API_BASE}/auth/me`, () => HttpResponse.json(devStore.hrUser)),

  http.get(`${API_BASE}/employees`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const filtered = applyFilters(devStore.employees, url);
    return HttpResponse.json({
      data: paginate(filtered, page, pageSize),
      total: filtered.length,
      page,
      pageSize,
    });
  }),

  http.post(`${API_BASE}/employees`, async ({ request }) => {
    const input = (await request.json()) as EmployeeInput;
    const now = new Date().toISOString();
    const employee: Employee = {
      id: `emp-${devStore.employees.length + 1}-${Date.now()}`,
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    devStore.employees.unshift(employee);
    return HttpResponse.json(employee, { status: 201 });
  }),

  http.get(`${API_BASE}/employees/:id`, ({ params }) => {
    const employee = devStore.employees.find((e) => e.id === params.id);
    if (!employee) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(employee);
  }),

  http.put(`${API_BASE}/employees/:id`, async ({ params, request }) => {
    const input = (await request.json()) as EmployeeInput;
    const index = devStore.employees.findIndex((e) => e.id === params.id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    const updated: Employee = {
      ...devStore.employees[index],
      ...input,
      id: devStore.employees[index].id,
      updatedAt: new Date().toISOString(),
    };
    devStore.employees[index] = updated;
    return HttpResponse.json(updated);
  }),

  http.delete(`${API_BASE}/employees/:id`, ({ params }) => {
    devStore.employees = devStore.employees.filter((e) => e.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_BASE}/insights/summary`, () => {
    const employees = devStore.employees;
    const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);
    const countryCounts = countBy(employees, (e) => e.country);
    const titleCounts = countBy(employees, (e) => e.jobTitle);
    const summary: InsightsSummary = {
      totalEmployees: employees.length,
      totalPayroll,
      topCountries: toRanked(countryCounts).map(([country, count]) => ({ country, count })),
      topJobTitles: toRanked(titleCounts).map(([jobTitle, count]) => ({ jobTitle, count })),
    };
    return HttpResponse.json(summary);
  }),

  http.get(`${API_BASE}/insights/by-country`, () => {
    const groups = groupBy(devStore.employees, (e) => e.country);
    const result: InsightsByCountry = Object.entries(groups).map(([country, list]) => {
      const salaries = list.map((e) => e.salary);
      return {
        country,
        count: list.length,
        min: Math.min(...salaries),
        max: Math.max(...salaries),
        avg: Math.round(salaries.reduce((s, v) => s + v, 0) / salaries.length),
        median: median(salaries),
        bands: salaryBands(salaries),
      };
    });
    return HttpResponse.json(result);
  }),

  http.get(`${API_BASE}/insights/by-job-title`, ({ request }) => {
    const url = new URL(request.url);
    const country = url.searchParams.get('country');
    const scope = country
      ? devStore.employees.filter((e) => e.country === country)
      : devStore.employees;
    const groups = groupBy(scope, (e) => e.jobTitle);
    const result: InsightsByJobTitle = Object.entries(groups).map(([jobTitle, list]) => ({
      jobTitle,
      count: list.length,
      avg: Math.round(list.reduce((s, e) => s + e.salary, 0) / list.length),
    }));
    return HttpResponse.json(result);
  }),
];

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}

function countBy<T>(items: T[], key: (item: T) => string): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const k = key(item);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
}

function toRanked(counts: Record<string, number>): [string, number][] {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

function salaryBands(salaries: number[]) {
  const bands = [
    { label: '< 50k', max: 50_000_00, count: 0 },
    { label: '50k–100k', max: 100_000_00, count: 0 },
    { label: '100k–200k', max: 200_000_00, count: 0 },
    { label: '> 200k', max: Infinity, count: 0 },
  ];
  for (const s of salaries) {
    for (const band of bands) {
      if (s < band.max) {
        band.count++;
        break;
      }
    }
  }
  return bands.map(({ label, count }) => ({ label, count }));
}
