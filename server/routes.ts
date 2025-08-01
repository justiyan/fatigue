import type { Express } from "express";
import { createServer, type Server } from "http";
import { fatigueInputSchema, type FatigueInput, type FatigueResult } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Fatigue calculation endpoint
  app.post("/api/calculate-fatigue", (req, res) => {
    try {
      const input: FatigueInput = fatigueInputSchema.parse(req.body);
      
      const result = calculateFatigueScore(input);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid input data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
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
  
  return {
    score: fatigueScore,
    level,
    totalSleep48,
    hoursAwake: Math.round(hoursAwake * 10) / 10,
  };
}
