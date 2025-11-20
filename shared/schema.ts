import { z } from "zod";

// Zod schemas for API validation
export const fatigueInputSchema = z.object({
  sleepLast24: z.number().min(0).max(24),
  sleepPrevious24: z.number().min(0).max(24),
  wakeTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  workStartTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
});

export const timeProjectionSchema = z.object({
  time: z.string(),
  level: z.enum(['Low', 'Moderate', 'High', 'Extreme']),
  score: z.number(),
});

export const fatigueResultSchema = z.object({
  score: z.number().min(0).max(10),
  level: z.enum(['Low', 'Moderate', 'High', 'Extreme']),
  totalSleep48: z.number(),
  hoursAwake: z.number(),
  projections: z.array(timeProjectionSchema),
});

// Types
export type FatigueInput = z.infer<typeof fatigueInputSchema>;
export type TimeProjection = z.infer<typeof timeProjectionSchema>;
export type FatigueResult = z.infer<typeof fatigueResultSchema>;
