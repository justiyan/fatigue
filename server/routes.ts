import type { Express } from "express";
import { createServer, type Server } from "http";
import { fatigueInputSchema, type FatigueInput, type FatigueResult } from "@shared/schema";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Fatigue calculation endpoint
  app.post("/api/calculate-fatigue", async (req, res) => {
    try {
      const input: FatigueInput = fatigueInputSchema.parse(req.body);
      
      const result = calculateFatigueScore(input);
      
      // Store the assessment in the database for audit purposes
      await storage.createFatigueAssessment({
        sleepLast24: input.sleepLast24,
        sleepPrevious24: input.sleepPrevious24,
        wakeTime: input.wakeTime,
        workStartTime: input.workStartTime,
        fatigueScore: result.score,
        fatigueLevel: result.level,
        totalSleep48: result.totalSleep48,
        hoursAwake: result.hoursAwake.toString(),
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error processing fatigue calculation:", error);
      res.status(400).json({ message: "Invalid input data" });
    }
  });

  // Get recent assessments endpoint (for audit/history purposes)
  app.get("/api/fatigue-assessments", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const assessments = await storage.getRecentFatigueAssessments(limit);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching fatigue assessments:", error);
      res.status(500).json({ message: "Internal server error" });
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
