import { z } from 'zod';

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const meResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});

export type MeResponse = z.infer<typeof meResponseSchema>;

export const employmentTypeSchema = z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACTOR']);
export type EmploymentType = z.infer<typeof employmentTypeSchema>;

export const employeeSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  jobTitle: z.string(),
  department: z.string(),
  country: z.string(),
  currency: z.string(),
  salary: z.number(),
  employmentType: employmentTypeSchema,
  hireDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Employee = z.infer<typeof employeeSchema>;

export const employeeListResponseSchema = z.object({
  data: z.array(employeeSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export type EmployeeListResponse = z.infer<typeof employeeListResponseSchema>;

export const insightsSummarySchema = z.object({
  totalEmployees: z.number(),
  totalPayroll: z.number(),
  topCountries: z.array(z.object({ country: z.string(), count: z.number() })),
  topJobTitles: z.array(z.object({ jobTitle: z.string(), count: z.number() })),
});

export type InsightsSummary = z.infer<typeof insightsSummarySchema>;

export const insightsByCountrySchema = z.array(
  z.object({
    country: z.string(),
    currency: z.string(),
    count: z.number(),
    min: z.number(),
    max: z.number(),
    avg: z.number(),
    median: z.number(),
    bands: z.array(z.object({ label: z.string(), count: z.number() })),
  }),
);

export type InsightsByCountry = z.infer<typeof insightsByCountrySchema>;

export const insightsByJobTitleSchema = z.array(
  z.object({
    jobTitle: z.string(),
    count: z.number(),
    avg: z.number(),
  }),
);

export type InsightsByJobTitle = z.infer<typeof insightsByJobTitleSchema>;
