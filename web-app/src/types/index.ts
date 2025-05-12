// Metric types
export interface Metric {
  id: number;
  userId: number;
  date: Date;
  mentalScore: number;
  physicalActivity: number;
  physicalActivityGoal: number;
  sleep: number;
  sleepGoal: number;
  screenTime: number;
  screenTimeGoal: number;
  ambientNoise: number;
  ambientNoiseGoal: number;
}

// User types
export interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  joinDate: Date;
  profileImage: string | null;
}

// Survey types
export interface SurveyResponse {
  id: number;
  userId: number;
  date: Date;
  overallMood: number;
  sleepQuality: number;
  stressLevel: number;
  overwhelmed: string;
  socialConnection: number;
  completed: boolean;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: "scale" | "choice";
  field: keyof Omit<SurveyResponse, "id" | "userId" | "date" | "completed">;
  min?: string;
  max?: string;
  options?: { value: string; label: string }[];
}
