import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

// Define schemas directly in the serverless function to avoid import issues
const symptomChecklistSchema = z.object({
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

const fatigueInputSchema = z.object({
  sleepLast24: z.number().min(0).max(24),
  sleepPrevious24: z.number().min(0).max(24),
  wakeTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  workStartTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  symptomChecklist: symptomChecklistSchema.optional(),
});

type SymptomChecklist = z.infer<typeof symptomChecklistSchema>;
type FatigueInput = z.infer<typeof fatigueInputSchema>;
type TimeProjection = {
  time: string;
  level: 'Low' | 'Moderate' | 'High' | 'Extreme';
  score: number;
};
type SymptomResult = {
  symptomScore: number;
  symptomLevel: 'Low' | 'Moderate' | 'High' | 'Extreme';
  hasHighRiskWork: boolean;
};
type FatigueResult = {
  score: number;
  level: 'Low' | 'Moderate' | 'High' | 'Extreme';
  totalSleep48: number;
  hoursAwake: number;
  projections: TimeProjection[];
  symptomResult?: SymptomResult;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('API called with method:', req.method);
  console.log('Request body:', req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const input: FatigueInput = fatigueInputSchema.parse(req.body);
    console.log('Input validated successfully:', input);

    const result = calculateFatigueScore(input);
    console.log('Calculation completed:', result);

    res.json(result);
  } catch (error) {
    console.error("Error processing fatigue calculation:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');

    if (error instanceof z.ZodError) {
      console.error("Zod validation errors:", error.errors);
      res.status(400).json({ message: "Invalid input data", errors: error.errors });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

function calculateSymptomScore(checklist: SymptomChecklist): SymptomResult {
  let score = 0;
  let hasHighRiskWork = false;

  // Regular symptoms (1 point each)
  const regularSymptoms = [
    'strugglingAlert', 'troubleConcentrating', 'unusualMistakes', 'slowResponses',
    'yawningFrequently', 'physicalSymptoms', 'hardToStayAwake', 'poorCoordination',
    'moodChanges', 'decisionDifficulty', 'feelingOverwhelmed', 'concernsRaised',
    'brokenSleep', 'overnightSupport', 'overnightIncident', 'insufficientRest'
  ] as const;

  // High-risk work (2 points each)
  const highRiskSymptoms = [
    'requiredToDrive', 'administerMedication', 'highBehavioralSupport', 'workingAlone'
  ] as const;

  regularSymptoms.forEach(symptom => {
    if (checklist[symptom]) score += 1;
  });

  highRiskSymptoms.forEach(symptom => {
    if (checklist[symptom]) {
      score += 2;
      hasHighRiskWork = true;
    }
  });

  // Determine symptom level
  let symptomLevel: 'Low' | 'Moderate' | 'High' | 'Extreme';
  if (score <= 2) symptomLevel = 'Low';
  else if (score <= 5) symptomLevel = 'Moderate';
  else if (score <= 8) symptomLevel = 'High';
  else symptomLevel = 'Extreme';

  return {
    symptomScore: score,
    symptomLevel,
    hasHighRiskWork,
  };
}

function calculateFatigueScore(input: FatigueInput): FatigueResult {
  const { sleepLast24, sleepPrevious24, wakeTime, workStartTime, symptomChecklist } = input;

  let fatigueScore = 0;

  // Sleep deficit scoring based on industry standards
  if (sleepLast24 < 5) fatigueScore += 4;
  else if (sleepLast24 < 6) fatigueScore += 3;
  else if (sleepLast24 < 7) fatigueScore += 2;
  else if (sleepLast24 < 8) fatigueScore += 1;

  const totalSleep48 = sleepLast24 + sleepPrevious24;
  if (totalSleep48 < 12) fatigueScore += 3;
  else if (totalSleep48 < 14) fatigueScore += 2;
  else if (totalSleep48 < 16) fatigueScore += 1;

  // Time awake calculation
  const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
  const [workHour, workMinute] = workStartTime.split(':').map(Number);

  const wakeTimeMinutes = wakeHour * 60 + wakeMinute;
  const workTimeMinutes = workHour * 60 + workMinute;

  let timeAwakeMinutes = workTimeMinutes - wakeTimeMinutes;
  if (timeAwakeMinutes < 0) timeAwakeMinutes += 24 * 60; // Next day

  const hoursAwake = timeAwakeMinutes / 60;

  // Time awake scoring
  if (hoursAwake > 18) fatigueScore += 4;
  else if (hoursAwake > 16) fatigueScore += 3;
  else if (hoursAwake > 14) fatigueScore += 2;
  else if (hoursAwake > 12) fatigueScore += 1;

  // Night shift penalty (11pm to 5am as per Energy Queensland standards)
  if (workHour >= 23 || workHour <= 5) {
    fatigueScore += 2;
  }

  // Early morning start penalty (before 6am)
  if (workHour < 6 && workHour > 0) {
    fatigueScore += 1;
  }

  // Cap score at 10
  fatigueScore = Math.min(10, Math.max(0, fatigueScore));

  // Determine fatigue level
  let level: 'Low' | 'Moderate' | 'High' | 'Extreme';
  if (fatigueScore <= 3) level = 'Low';
  else if (fatigueScore <= 6) level = 'Moderate';
  else if (fatigueScore <= 8) level = 'High';
  else level = 'Extreme';

  // Generate hourly projections for the next 24 hours
  const projections = generateTimeProjections(input, workTimeMinutes);

  // Calculate symptom result if checklist provided
  let symptomResult: SymptomResult | undefined;
  if (symptomChecklist) {
    symptomResult = calculateSymptomScore(symptomChecklist);
  }

  return {
    score: fatigueScore,
    level,
    totalSleep48,
    hoursAwake: Math.round(hoursAwake * 10) / 10,
    projections,
    symptomResult,
  };
}

function generateTimeProjections(input: FatigueInput, workStartMinutes: number): TimeProjection[] {
  const { sleepLast24, sleepPrevious24, wakeTime } = input;
  const projections: TimeProjection[] = [];

  // Start from work start time and project for 24 hours
  const startTime = workStartMinutes;
  let maxFatigueScore = 0; // Track the highest fatigue level reached

  for (let i = 0; i < 24; i++) {
    const currentTimeMinutes = (startTime + (i * 60)) % (24 * 60);
    const currentHour = Math.floor(currentTimeMinutes / 60);
    const currentMinute = currentTimeMinutes % 60;

    // Format time as HH:MM
    const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

    // Calculate fatigue score for this time
    let fatigueScore = 0;

    // Sleep deficit scoring (baseline fatigue from lack of sleep)
    if (sleepLast24 < 5) fatigueScore += 4;
    else if (sleepLast24 < 6) fatigueScore += 3;
    else if (sleepLast24 < 7) fatigueScore += 2;
    else if (sleepLast24 < 8) fatigueScore += 1;

    const totalSleep48 = sleepLast24 + sleepPrevious24;
    if (totalSleep48 < 12) fatigueScore += 3;
    else if (totalSleep48 < 14) fatigueScore += 2;
    else if (totalSleep48 < 16) fatigueScore += 1;

    // Calculate hours awake from wake time to current projected time
    const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
    const wakeTimeMinutes = wakeHour * 60 + wakeMinute;

    let timeAwakeMinutes = currentTimeMinutes - wakeTimeMinutes;
    if (timeAwakeMinutes < 0) timeAwakeMinutes += 24 * 60; // Handle next day

    const hoursAwake = timeAwakeMinutes / 60;

    // Time awake penalty increases progressively (cumulative fatigue)
    if (hoursAwake > 18) fatigueScore += 4;
    else if (hoursAwake > 16) fatigueScore += 3;
    else if (hoursAwake > 14) fatigueScore += 2;
    else if (hoursAwake > 12) fatigueScore += 1;

    // Night shift penalty (circadian rhythm disruption)
    if (currentHour >= 23 || currentHour <= 5) {
      fatigueScore += 2;
    }

    // Early morning penalty
    if (currentHour < 6 && currentHour > 0) {
      fatigueScore += 1;
    }

    // Cap score at 10
    fatigueScore = Math.min(10, Math.max(0, fatigueScore));

    // Critical fix: Fatigue can only increase or stay the same during wakefulness
    // Once you reach a fatigue level, you cannot drop below it without sleep
    maxFatigueScore = Math.max(maxFatigueScore, fatigueScore);
    fatigueScore = maxFatigueScore;

    // Determine level based on cumulative fatigue
    let level: 'Low' | 'Moderate' | 'High' | 'Extreme';
    if (fatigueScore <= 3) level = 'Low';
    else if (fatigueScore <= 6) level = 'Moderate';
    else if (fatigueScore <= 8) level = 'High';
    else level = 'Extreme';

    projections.push({
      time: timeString,
      level,
      score: fatigueScore,
    });
  }

  return projections;
}