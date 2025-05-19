export interface MentalHealthRecord {
  date: string;
  on_bike: number;
  on_foot: number;
  running: number;
  still: number;
  user_id: string;
  conversation_count: number;
  total_conversation_duration: number;
  average_conversation_duration: number;
  max_conversation_duration: number;
  min_conversation_duration: number;
  total_dark_time: number;
  avg_dark_time: number;
  max_dark_time: number;
  screen_time_total: number;
  screen_sessions: number;
  max_screen_time: number;
  avg_screen_time: number;
  hour: number;
  rate: number;
  hour_3day_avg: number;
  rate_3day_avg: number;
  hour_mapped: number;
  rate_rounded: number;
  stress_level: number;
  stress_3day_avg: number;
  app_usage: number;
  total_distance_km: number;
  unique_locations: number;
}

export interface ProcessedUserData {
  userId: string;
  records: MentalHealthRecord[];
  insights: UserInsight[];
  correlations: Correlation[];
  stressFactors: StressFactor[];
  recommendations: Recommendation[];
}

export interface UserInsight {
  type: 'observation' | 'pattern' | 'anomaly';
  description: string;
  confidence: number; // 0-1
  relatedMetrics: string[];
}

export interface Correlation {
  factor1: string;
  factor2: string;
  correlationStrength: number; // -1 to 1
  description: string;
}

export interface StressFactor {
  factor: string;
  impact: number; // 0-1, how strongly it affects stress
  description: string;
}

export interface Recommendation {
  category: 'activity' | 'sleep' | 'screen' | 'social' | 'location';
  description: string;
  expectedImpact: number; // 0-1
  confidence: number; // 0-1
}

export interface UserMetrics {
  // Basic metrics
  mentalScore: number;
  physicalActivity: {
    current: number;
    goal: number;
    status: string;
  };
  sleep: {
    current: number;
    goal: number;
    status: string;
  };
  screenTime: {
    current: number;
    goal: number;
    status: string;
  };
  ambientNoise: {
    current: number;
    goal: number;
    status: string;
  };
  
  // Advanced metrics
  darkTime: {
    total: number;
    average: number;
    max: number;
  };
  conversation: {
    count: number;
    totalDuration: number;
    avgDuration: number;
    maxDuration: number;
  };
  locations: {
    totalDistance: number;
    uniqueLocations: number;
  };
  activities: {
    onBike: number;
    onFoot: number;
    running: number;
    still: number;
  };
  stressLevel: number;
  dayHistory: number[];
}