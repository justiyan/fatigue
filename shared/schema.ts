import { z } from "zod";

// Symptom checklist schemas
export const symptomChecklistSchema = z.object({
  // Alertness and concentration
  strugglingAlert: z.boolean().default(false),
  troubleConcentrating: z.boolean().default(false),
  unusualMistakes: z.boolean().default(false),
  slowResponses: z.boolean().default(false),

  // Physical signs
  yawningFrequently: z.boolean().default(false),
  physicalSymptoms: z.boolean().default(false),
  hardToStayAwake: z.boolean().default(false),
  poorCoordination: z.boolean().default(false),

  // Mood and behaviour
  moodChanges: z.boolean().default(false),
  decisionDifficulty: z.boolean().default(false),
  feelingOverwhelmed: z.boolean().default(false),
  concernsRaised: z.boolean().default(false),

  // High-risk work
  requiredToDrive: z.boolean().default(false),
  administerMedication: z.boolean().default(false),
  highBehavioralSupport: z.boolean().default(false),
  workingAlone: z.boolean().default(false),

  // Overnight disruption
  brokenSleep: z.boolean().default(false),
  overnightSupport: z.boolean().default(false),
  overnightIncident: z.boolean().default(false),
  insufficientRest: z.boolean().default(false),
});

// Zod schemas for API validation
export const fatigueInputSchema = z.object({
  sleepLast24: z.number().min(0).max(24),
  sleepPrevious24: z.number().min(0).max(24),
  wakeTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  workStartTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  symptomChecklist: symptomChecklistSchema.optional(),
});

export const timeProjectionSchema = z.object({
  time: z.string(),
  level: z.enum(['Low', 'Moderate', 'High', 'Extreme']),
  score: z.number(),
});

export const symptomResultSchema = z.object({
  symptomScore: z.number(),
  symptomLevel: z.enum(['Low', 'Moderate', 'High', 'Extreme']),
  hasHighRiskWork: z.boolean(),
});

export const fatigueResultSchema = z.object({
  score: z.number().min(0).max(10),
  level: z.enum(['Low', 'Moderate', 'High', 'Extreme']),
  totalSleep48: z.number(),
  hoursAwake: z.number(),
  projections: z.array(timeProjectionSchema),
  symptomResult: symptomResultSchema.optional(),
});

// Types
export type SymptomChecklist = z.infer<typeof symptomChecklistSchema>;
export type SymptomResult = z.infer<typeof symptomResultSchema>;
export type FatigueInput = z.infer<typeof fatigueInputSchema>;
export type TimeProjection = z.infer<typeof timeProjectionSchema>;
export type FatigueResult = z.infer<typeof fatigueResultSchema>;
