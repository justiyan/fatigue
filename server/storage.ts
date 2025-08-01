import { fatigueAssessments, type FatigueAssessment, type InsertFatigueAssessment } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createFatigueAssessment(assessment: InsertFatigueAssessment): Promise<FatigueAssessment>;
  getFatigueAssessment(id: number): Promise<FatigueAssessment | undefined>;
  getRecentFatigueAssessments(limit?: number): Promise<FatigueAssessment[]>;
}

export class DatabaseStorage implements IStorage {
  async createFatigueAssessment(assessment: InsertFatigueAssessment): Promise<FatigueAssessment> {
    const [result] = await db
      .insert(fatigueAssessments)
      .values(assessment)
      .returning();
    return result;
  }

  async getFatigueAssessment(id: number): Promise<FatigueAssessment | undefined> {
    const [result] = await db
      .select()
      .from(fatigueAssessments)
      .where(eq(fatigueAssessments.id, id));
    return result || undefined;
  }

  async getRecentFatigueAssessments(limit: number = 100): Promise<FatigueAssessment[]> {
    return await db
      .select()
      .from(fatigueAssessments)
      .orderBy(desc(fatigueAssessments.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
