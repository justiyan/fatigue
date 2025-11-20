import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // No API routes needed - using Vercel serverless functions

  const httpServer = createServer(app);
  return httpServer;
}
