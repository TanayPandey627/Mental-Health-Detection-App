import { loadAndProcessData } from './data-processor';
import dotenv from 'dotenv';
dotenv.config({ path: './ai-integration/.env' });
import { enhanceInsightsWithClaude } from './ai-predictor';
import { ProcessedUserData, UserMetrics } from './types';
import express from 'express';
import fs from 'fs';
import path from 'path';

// Initialize the AI integration route
export function initAiRoutes(app: express.Express): void {
  // Endpoint to get AI-processed insights for a user
  app.get('/api/ai/insights/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      // Load and process the user's data
      let userData = await loadAndProcessData(userId);
      
      if (!userData) {
        return res.status(404).json({ error: 'No data found for this user' });
      }
      
      // Enhance insights with Claude if API key is available
      if (process.env.ANTHROPIC_API_KEY) {
        userData = await enhanceInsightsWithClaude(userData);
      }
      
      // Return the processed data
      res.json(userData);
    } catch (error) {
      console.error('Error in AI insights endpoint:', error);
      res.status(500).json({ error: 'Failed to process mental health data' });
    }
  });
  
  // Endpoint to get latest metrics for a user (including advanced metrics)
  app.get('/api/ai/metrics/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      // Process data for user
      const userData = await loadAndProcessData(userId);
      
      if (!userData || userData.records.length === 0) {
        return res.status(404).json({ error: 'No data found for this user' });
      }
      
      // Extract the latest record
      const latestRecord = userData.records[userData.records.length - 1];
      
      // Calculate metrics from this record
      const metrics: UserMetrics = {
        // Basic metrics (similar to what we already track in the app)
        mentalScore: Math.max(100 - (latestRecord.stress_level * 20), 0),
        physicalActivity: {
          current: Math.round((latestRecord.on_foot + latestRecord.on_bike + latestRecord.running) * 1440), // convert from decimal to minutes
          goal: 30, // 30 mins of activity per day
          status: getStatusText((latestRecord.on_foot + latestRecord.on_bike + latestRecord.running) * 1440, 30)
        },
        sleep: {
          current: 480 - Math.round(latestRecord.screen_time_total * 0.2), // rough approximation
          goal: 480, // 8 hours
          status: getStatusText(480 - Math.round(latestRecord.screen_time_total * 0.2), 480)
        },
        screenTime: {
          current: Math.round(latestRecord.screen_time_total),
          goal: 180, // 3 hours target
          status: getStatusText(180, Math.round(latestRecord.screen_time_total), true)
        },
        ambientNoise: {
          current: 45, // Mock value
          goal: 60,
          status: getStatusText(60, 45, true)
        },
        
        // Advanced metrics (new data from the dataset)
        darkTime: {
          total: latestRecord.total_dark_time,
          average: latestRecord.avg_dark_time,
          max: latestRecord.max_dark_time
        },
        conversation: {
          count: latestRecord.conversation_count,
          totalDuration: latestRecord.total_conversation_duration,
          avgDuration: latestRecord.average_conversation_duration,
          maxDuration: latestRecord.max_conversation_duration
        },
        locations: {
          totalDistance: latestRecord.total_distance_km,
          uniqueLocations: latestRecord.unique_locations
        },
        activities: {
          onBike: parseFloat((latestRecord.on_bike * 100).toFixed(1)),
          onFoot: parseFloat((latestRecord.on_foot * 100).toFixed(1)),
          running: parseFloat((latestRecord.running * 100).toFixed(1)),
          still: parseFloat((latestRecord.still * 100).toFixed(1))
        },
        stressLevel: latestRecord.stress_level,
        dayHistory: userData.records.slice(-14).map(r => r.stress_level) // Last 2 weeks
      };
      
      res.json(metrics);
    } catch (error) {
      console.error('Error in AI metrics endpoint:', error);
      res.status(500).json({ error: 'Failed to process metrics data' });
    }
  });

  // Endpoint to get recommendations for a user
  app.get('/api/ai/recommendations/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      // Process data for user
      const userData = await loadAndProcessData(userId);
      
      if (!userData) {
        return res.status(404).json({ error: 'No data found for this user' });
      }
      
      // If Anthropic API key is available, enhance the recommendations
      let enhancedData = userData;
      if (process.env.ANTHROPIC_API_KEY) {
        enhancedData = await enhanceInsightsWithClaude(userData) || userData;
      }
      
      // Return just the recommendations
      res.json({
        userId,
        recommendations: enhancedData.recommendations,
        insights: enhancedData.insights
      });
    } catch (error) {
      console.error('Error in AI recommendations endpoint:', error);
      res.status(500).json({ error: 'Failed to process recommendations' });
    }
  });

  // Setup sample data if it doesn't exist (for testing purposes only)
  setupSampleData();
}

// Helper function to get status text based on values
function getStatusText(value: number, goal: number, isReversed: boolean = false): string {
  const percentage = isReversed
    ? (goal / Math.max(value, 1)) * 100
    : (value / goal) * 100;
  
  if (isReversed) {
    if (percentage >= 100) return "Low";
    if (percentage >= 75) return "Moderate";
    return "High";
  } else {
    if (percentage >= 90) return "Good";
    if (percentage >= 60) return "Fair";
    return "Poor";
  }
}

// Helper function to setup sample data for testing
function setupSampleData() {
  const dataDir = path.join(process.cwd(), 'data');
  const sampleDataPath = path.join(dataDir, 'mental_health_data.csv');
  
  // Create the data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Only create sample data if it doesn't exist
  if (!fs.existsSync(sampleDataPath)) {
    console.log('Setting up sample mental health data for testing...');
    
    // Extract sample data from the attached CSV in the repository
    const attachedDataPath = path.join(process.cwd(), 'attached_assets/Final.csv');
    
    if (fs.existsSync(attachedDataPath)) {
      // Copy the attached data to our data directory
      fs.copyFileSync(attachedDataPath, sampleDataPath);
      console.log('Sample data setup complete.');
    } else {
      console.log('Could not find attached data. Creating minimal sample data.');
      
      // Create a minimal CSV with some sample data
      const sampleCsvHeader = 'date,on_bike,on_foot,running,still,user_id,conversation_count,total_conversation_duration,average_conversation_duration,max_conversation_duration,min_conversation_duration,total_dark_time,avg_dark_time,max_dark_time,screen_time_total,screen_sessions,max_screen_time,avg_screen_time,hour,rate,hour_3day_avg,rate_3day_avg,hour_mapped,rate_rounded,stress_level,stress_3day_avg,app_usage,total_distance_km,unique_locations\n';
      const sampleCsvRows = [
        '2023-05-09,0.03,0.08,0.04,0.85,u00,21,22971,1093.8,5829,61,556.53,139.13,329.72,590.7,5,272.8,118.14,8,2,7.83,1.5,6.5,2,1,1.67,715.67,65.4,25\n',
        '2023-05-10,0.02,0.09,0.03,0.86,u00,23,23000,1000,5000,50,500,120,300,600,5,280,120,7,2,7.5,1.5,6,2,2,1.67,720,70,26\n',
        '2023-05-11,0.04,0.1,0.02,0.84,u00,25,24000,960,5100,52,520,125,310,580,4,290,145,8,1,7.67,1.67,6.5,1,1,1.33,700,60,24\n'
      ];
      
      fs.writeFileSync(sampleDataPath, sampleCsvHeader + sampleCsvRows.join(''));
      console.log('Minimal sample data created.');
    }
  }
}