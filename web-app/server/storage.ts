import { users, type User, type InsertUser, metrics, type Metric, type InsertMetric, surveyResponses, type SurveyResponse, type InsertSurveyResponse } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Metrics operations
  getMetricsByUserId(userId: number): Promise<Metric[]>;
  getLatestMetricsByUserId(userId: number): Promise<Metric | undefined>;
  createMetric(metric: InsertMetric): Promise<Metric>;
  getWeeklyMetricsByUserId(userId: number): Promise<Metric[]>;

  // Survey operations
  getSurveyResponsesByUserId(userId: number): Promise<SurveyResponse[]>;
  getLatestSurveyByUserId(userId: number): Promise<SurveyResponse | undefined>;
  createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  updateSurveyResponse(id: number, data: Partial<InsertSurveyResponse>): Promise<SurveyResponse | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private metrics: Map<number, Metric>;
  private surveyResponses: Map<number, SurveyResponse>;
  private userId: number;
  private metricId: number;
  private surveyId: number;

  constructor() {
    this.users = new Map();
    this.metrics = new Map();
    this.surveyResponses = new Map();
    this.userId = 1;
    this.metricId = 1;
    this.surveyId = 1;

    // Create a mock user for development
    const mockUser: User = {
      id: this.userId,
      username: "jessica_chen",
      password: "password123",
      displayName: "Jessica Chen",
      email: "jessica@example.com",
      joinDate: new Date("2023-01-15"),
      profileImage: null,
    };
    this.users.set(mockUser.id, mockUser);

    // Create mock metrics for the user
    const today = new Date();
    const mockMetric: Metric = {
      id: this.metricId,
      userId: mockUser.id,
      date: today,
      mentalScore: 82,
      physicalActivity: 45,
      physicalActivityGoal: 30,
      sleep: 390, // 6.5 hours in minutes
      sleepGoal: 480, // 8 hours in minutes
      screenTime: 312, // 5.2 hours in minutes
      screenTimeGoal: 180, // 3 hours in minutes
      ambientNoise: 42,
      ambientNoiseGoal: 60,
    };
    this.metrics.set(mockMetric.id, mockMetric);
    
    // Create mock survey responses
    const mockSurvey: SurveyResponse = {
      id: this.surveyId,
      userId: mockUser.id,
      date: today,
      overallMood: 3,
      sleepQuality: 4,
      stressLevel: 2,
      overwhelmed: "Sometimes, but manageable",
      socialConnection: 3,
      completed: false,
    };
    this.surveyResponses.set(mockSurvey.id, mockSurvey);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id,
      joinDate: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Metrics operations
  async getMetricsByUserId(userId: number): Promise<Metric[]> {
    return Array.from(this.metrics.values()).filter(
      (metric) => metric.userId === userId,
    );
  }

  async getLatestMetricsByUserId(userId: number): Promise<Metric | undefined> {
    const userMetrics = await this.getMetricsByUserId(userId);
    if (userMetrics.length === 0) return undefined;
    
    return userMetrics.reduce((latest, current) => {
      return latest.date > current.date ? latest : current;
    });
  }

  async createMetric(insertMetric: InsertMetric): Promise<Metric> {
    const id = this.metricId++;
    const metric: Metric = { ...insertMetric, id };
    this.metrics.set(id, metric);
    return metric;
  }

  async getWeeklyMetricsByUserId(userId: number): Promise<Metric[]> {
    const userMetrics = await this.getMetricsByUserId(userId);
    if (userMetrics.length === 0) return [];

    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return userMetrics.filter(metric => {
      const metricDate = new Date(metric.date);
      return metricDate >= oneWeekAgo && metricDate <= today;
    });
  }

  // Survey operations
  async getSurveyResponsesByUserId(userId: number): Promise<SurveyResponse[]> {
    return Array.from(this.surveyResponses.values()).filter(
      (response) => response.userId === userId,
    );
  }

  async getLatestSurveyByUserId(userId: number): Promise<SurveyResponse | undefined> {
    const userSurveys = await this.getSurveyResponsesByUserId(userId);
    if (userSurveys.length === 0) return undefined;
    
    return userSurveys.reduce((latest, current) => {
      return latest.date > current.date ? latest : current;
    });
  }

  async createSurveyResponse(insertResponse: InsertSurveyResponse): Promise<SurveyResponse> {
    const id = this.surveyId++;
    const response: SurveyResponse = { ...insertResponse, id };
    this.surveyResponses.set(id, response);
    return response;
  }

  async updateSurveyResponse(id: number, data: Partial<InsertSurveyResponse>): Promise<SurveyResponse | undefined> {
    const existingResponse = this.surveyResponses.get(id);
    if (!existingResponse) return undefined;
    
    const updatedResponse = { ...existingResponse, ...data };
    this.surveyResponses.set(id, updatedResponse);
    return updatedResponse;
  }
}

export const storage = new MemStorage();
