import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

// Define schemas directly in the serverless function to avoid import issues
const fatigueInputSchema = z.object({
  sleepLast24: z.number().min(0).max(24),
  sleepPrevious24: z.number().min(0).max(24),
  wakeTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  workStartTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
});

type FatigueInput = z.infer<typeof fatigueInputSchema>;
type TimeProjection = {
  time: string;
  level: 'Low' | 'Moderate' | 'High' | 'Extreme';
  score: number;
};
type FatigueResult = {
  score: number;
  level: 'Low' | 'Moderate' | 'High' | 'Extreme';
  totalSleep48: number;
  hoursAwake: number;
  projections: TimeProjection[];
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

function calculateFatigueScore(input: FatigueInput): FatigueResult {
  const { sleepLast24, sleepPrevious24, wakeTime, workStartTime } = input;

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

  return {
    score: fatigueScore,
    level,
    totalSleep48,
    hoursAwake: Math.round(hoursAwake * 10) / 10,
    projections,
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