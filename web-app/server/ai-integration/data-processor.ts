import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

interface MentalHealthRecord {
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

interface ProcessedUserData {
  userId: string;
  records: MentalHealthRecord[];
  insights: UserInsight[];
  correlations: Correlation[];
  stressFactors: StressFactor[];
  recommendations: Recommendation[];
}

interface UserInsight {
  type: 'observation' | 'pattern' | 'anomaly';
  description: string;
  confidence: number; // 0-1
  relatedMetrics: string[];
}

interface Correlation {
  factor1: string;
  factor2: string;
  correlationStrength: number; // -1 to 1
  description: string;
}

interface StressFactor {
  factor: string;
  impact: number; // 0-1, how strongly it affects stress
  description: string;
}

interface Recommendation {
  category: 'activity' | 'sleep' | 'screen' | 'social' | 'location';
  description: string;
  expectedImpact: number; // 0-1
  confidence: number; // 0-1
}

export async function loadAndProcessData(userId: string): Promise<ProcessedUserData | null> {
  try {
    const records: MentalHealthRecord[] = [];
    
    // In a real implementation, we would load data from the database
    // Here we'll simulate loading from a CSV file
    const csvPath = path.resolve(__dirname, '../../data/mental_health_data.csv');
    
    // Check if the file exists (in production, this would be a database query)
    if (!fs.existsSync(csvPath)) {
      console.log('Data file not found. Using mock data for simulation.');
      return createMockProcessedData(userId);
    }
    
    await new Promise<void>((resolve) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data: any) => {
          if (data.user_id === userId) {
            // Convert string numbers to actual numbers
            Object.keys(data).forEach(key => {
              if (key !== 'date' && key !== 'user_id') {
                data[key] = parseFloat(data[key]);
              }
            });
            records.push(data as MentalHealthRecord);
          }
        })
        .on('end', () => {
          resolve();
        });
    });
    
    if (records.length === 0) {
      console.log('No records found for this user. Using mock data.');
      return createMockProcessedData(userId);
    }
    
    // Process the records to generate insights
    const insights = generateInsights(records);
    const correlations = findCorrelations(records);
    const stressFactors = identifyStressFactors(records);
    const recommendations = generateRecommendations(records, stressFactors);
    
    return {
      userId,
      records,
      insights,
      correlations,
      stressFactors,
      recommendations
    };
  } catch (error) {
    console.error('Error processing mental health data:', error);
    return null;
  }
}

// AI simulation functions - In a real implementation, these would use actual ML models

function generateInsights(records: MentalHealthRecord[]): UserInsight[] {
  // This would normally be done with ML analysis
  return [
    {
      type: 'pattern',
      description: 'Your stress levels are typically higher on days with less physical activity',
      confidence: 0.85,
      relatedMetrics: ['on_foot', 'running', 'stress_level']
    },
    {
      type: 'pattern',
      description: 'More social conversation time correlates with improved wellbeing scores',
      confidence: 0.78,
      relatedMetrics: ['conversation_count', 'total_conversation_duration', 'stress_level']
    },
    {
      type: 'observation',
      description: 'Screen time before sleep appears to negatively impact your sleep quality',
      confidence: 0.72,
      relatedMetrics: ['screen_time_total', 'hour']
    },
    {
      type: 'anomaly',
      description: 'Weekends show significantly lower stress levels than weekdays',
      confidence: 0.9,
      relatedMetrics: ['date', 'stress_level']
    }
  ];
}

function findCorrelations(records: MentalHealthRecord[]): Correlation[] {
  // This would normally use correlation analysis or ML techniques
  return [
    {
      factor1: 'screen_time_total',
      factor2: 'stress_level',
      correlationStrength: 0.65,
      description: 'Increased screen time shows moderate correlation with higher stress levels'
    },
    {
      factor1: 'on_foot',
      factor2: 'stress_level',
      correlationStrength: -0.58,
      description: 'More time spent walking correlates with lower stress levels'
    },
    {
      factor1: 'conversation_count',
      factor2: 'stress_level',
      correlationStrength: -0.42,
      description: 'More social interactions correlate with lower stress levels'
    },
    {
      factor1: 'unique_locations',
      factor2: 'stress_level',
      correlationStrength: -0.38,
      description: 'Visiting more locations correlates with slightly lower stress levels'
    }
  ];
}

function identifyStressFactors(records: MentalHealthRecord[]): StressFactor[] {
  // This would normally use feature importance from ML models
  return [
    {
      factor: 'screen_time_total',
      impact: 0.72,
      description: 'Extended screen time appears to be a significant stress factor'
    },
    {
      factor: 'physical_activity',
      impact: 0.65,
      description: 'Lack of physical activity contributes notably to stress levels'
    },
    {
      factor: 'social_interaction',
      impact: 0.58,
      description: 'Limited social interaction appears to increase stress'
    },
    {
      factor: 'location_variety',
      impact: 0.45,
      description: 'Monotonous environments may contribute to stress'
    }
  ];
}

function generateRecommendations(
  records: MentalHealthRecord[],
  stressFactors: StressFactor[]
): Recommendation[] {
  // This would normally be based on ML prediction models
  return [
    {
      category: 'activity',
      description: 'Try to include at least 30 minutes of walking or other physical activity on high-stress days',
      expectedImpact: 0.7,
      confidence: 0.85
    },
    {
      category: 'screen',
      description: 'Reduce screen time before bed to improve sleep quality and reduce stress',
      expectedImpact: 0.65,
      confidence: 0.78
    },
    {
      category: 'social',
      description: 'Having more conversations throughout the day may help reduce stress levels',
      expectedImpact: 0.6,
      confidence: 0.75
    },
    {
      category: 'location',
      description: 'Visiting different environments throughout the week may help reduce monotony-related stress',
      expectedImpact: 0.5,
      confidence: 0.65
    }
  ];
}

// Fallback function to create mock data for testing
function createMockProcessedData(userId: string): ProcessedUserData {
  return {
    userId,
    records: [],
    insights: [
      {
        type: 'pattern',
        description: 'Your stress levels tend to be higher on days with less physical activity',
        confidence: 0.82,
        relatedMetrics: ['on_foot', 'running', 'stress_level']
      },
      {
        type: 'pattern',
        description: 'More social conversation time correlates with improved wellbeing scores',
        confidence: 0.75,
        relatedMetrics: ['conversation_count', 'total_conversation_duration', 'stress_level']
      }
    ],
    correlations: [
      {
        factor1: 'screen_time_total',
        factor2: 'stress_level',
        correlationStrength: 0.62,
        description: 'Increased screen time shows moderate correlation with higher stress levels'
      },
      {
        factor1: 'on_foot',
        factor2: 'stress_level',
        correlationStrength: -0.55,
        description: 'More time spent walking correlates with lower stress levels'
      }
    ],
    stressFactors: [
      {
        factor: 'screen_time_total',
        impact: 0.7,
        description: 'Extended screen time appears to be a significant stress factor'
      },
      {
        factor: 'physical_activity',
        impact: 0.62,
        description: 'Lack of physical activity contributes notably to stress levels'
      }
    ],
    recommendations: [
      {
        category: 'activity',
        description: 'Try to include at least 30 minutes of walking on high-stress days',
        expectedImpact: 0.68,
        confidence: 0.82
      },
      {
        category: 'screen',
        description: 'Reduce screen time before bed to improve sleep quality',
        expectedImpact: 0.63,
        confidence: 0.75
      }
    ]
  };
}