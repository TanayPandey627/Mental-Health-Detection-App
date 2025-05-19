import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSurveyResponseSchema } from "../shared/schema";
import { z } from "zod";
import { initAiRoutes } from "./ai-integration";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // User routes
  app.get("/api/user/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Metrics routes
  app.get("/api/metrics/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const metrics = await storage.getMetricsByUserId(userId);
    res.json(metrics);
  });

  app.get("/api/metrics/:userId/latest", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const latestMetrics = await storage.getLatestMetricsByUserId(userId);
    if (!latestMetrics) {
      return res.status(404).json({ message: "No metrics found for this user" });
    }

    res.json(latestMetrics);
  });

  app.get("/api/metrics/:userId/weekly", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const weeklyMetrics = await storage.getWeeklyMetricsByUserId(userId);
    res.json(weeklyMetrics);
  });

  // Survey routes
  app.get("/api/survey/:userId/latest", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const latestSurvey = await storage.getLatestSurveyByUserId(userId);
    if (!latestSurvey) {
      return res.status(404).json({ message: "No survey found for this user" });
    }

    res.json(latestSurvey);
  });

  app.post("/api/survey", async (req, res) => {
    try {
      const surveyData = insertSurveyResponseSchema.parse(req.body);
      const survey = await storage.createSurveyResponse(surveyData);
      res.status(201).json(survey);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid survey data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/survey/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid survey ID" });
    }

    try {
      const updateData = insertSurveyResponseSchema.partial().parse(req.body);
      const updatedSurvey = await storage.updateSurveyResponse(id, updateData);
      
      if (!updatedSurvey) {
        return res.status(404).json({ message: "Survey not found" });
      }
      
      res.json(updatedSurvey);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid survey data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Advanced Metric & AI routes
  app.get("/api/advanced-metrics/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // This is a simplified route that returns mock data for now
    // In a real implementation, this would use the AI integration
    const mockAdvancedMetrics = {
      darkTime: { 
        total: 556.53, 
        average: 139.13, 
        max: 329.72 
      },
      conversation: { 
        count: 21, 
        totalDuration: 22971, 
        avgDuration: 1094,
        maxDuration: 5829
      },
      locations: {
        totalDistance: 65.4,
        uniqueLocations: 25
      },
      activities: {
        onBike: 3.0,
        onFoot: 11.0, 
        running: 4.7,
        still: 81.3
      },
      stressLevel: 1.67,
      dayHistory: [1.0, 2.67, 2.5, 4.5, 1.5, 1.5, 1.0, 5.0, 3.0, 2.0, 1.0, 2.0, 3.0]
    };

    res.json(mockAdvancedMetrics);
  });

  // Initialize AI-specific routes
  initAiRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
