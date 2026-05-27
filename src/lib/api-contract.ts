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
