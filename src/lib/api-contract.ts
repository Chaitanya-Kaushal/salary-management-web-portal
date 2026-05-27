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
