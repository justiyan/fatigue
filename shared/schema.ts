import { z } from "zod";
import { pgTable, serial, integer, varchar, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Database tables
export const fatigueAssessments = pgTable("fatigue_assessments", {
  id: serial("id").primaryKey(),
  sleepLast24: integer("sleep_last_24").notNull(),
  sleepPrevious24: integer("sleep_previous_24").notNull(),
  wakeTime: varchar("wake_time", { length: 5 }).notNull(),
  workStartTime: varchar("work_start_time", { length: 5 }).notNull(),
  fatigueScore: integer("fatigue_score").notNull(),
  fatigueLevel: varchar("fatigue_level", { length: 20 }).notNull(),
  totalSleep48: integer("total_sleep_48").notNull(),
  hoursAwake: decimal("hours_awake", { precision: 3, scale: 1 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

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

// Insert schema for database operations
export const insertFatigueAssessmentSchema = createInsertSchema(fatigueAssessments).omit({
  id: true,
  createdAt: true,
});

// Types
export type FatigueInput = z.infer<typeof fatigueInputSchema>;
export type TimeProjection = z.infer<typeof timeProjectionSchema>;
export type FatigueResult = z.infer<typeof fatigueResultSchema>;
export type FatigueAssessment = typeof fatigueAssessments.$inferSelect;
export type InsertFatigueAssessment = z.infer<typeof insertFatigueAssessmentSchema>;
