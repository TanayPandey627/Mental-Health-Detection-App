import Anthropic from '@anthropic-ai/sdk';
import { ProcessedUserData } from './types';

// Initialize Anthropic client
// Note: In production, move the API key to environment variables
const anthropic = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY || 'dummy-key'
, // Will be populated by user
});

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const MODEL = 'claude-3-7-sonnet-20250219';

export async function enhanceInsightsWithClaude(
  userData: ProcessedUserData
): Promise<ProcessedUserData | null> {
  try {
    if (!process.env.ANTHROPIC_API_KEY)
 {
      console.warn('ANTHROPIC_API_KEY not found, skipping AI enhancement');
      return userData;
    }

    // Prepare the data summary for Claude
    const userDataSummary = prepareDataSummary(userData);

    // Prepare the prompt
    const systemPrompt = `You are an AI health assistant specialized in analyzing mental health data patterns.
Your task is to analyze the user's data and provide personalized insights and recommendations.
Be empathetic and considerate of the user's wellbeing.
Format your response as JSON with the following structure:
{
  "enhancedInsights": [
    {
      "type": "observation|pattern|anomaly",
      "description": "Concise and personalized insight description",
      "confidence": <number between 0-1>,
      "relatedMetrics": ["relevant_metric_1", "relevant_metric_2"]
    }
  ],
  "personalizedRecommendations": [
    {
      "category": "activity|sleep|screen|social|location",
      "description": "Specific and actionable recommendation",
      "expectedImpact": <number between 0-1>,
      "confidence": <number between 0-1>
    }
  ]
}`;

    const userPrompt = `Here is a summary of a user's mental health data:
${userDataSummary}

Based on this data, please provide:
1. Enhanced insights that are personalized and detailed
2. Personalized recommendations that are specific, actionable, and tailored to this user's patterns

Your analysis should focus on finding connections between their behaviors and stress levels, and suggest personalized interventions.`;

    // Call Claude API
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    // Extract and parse the JSON response
    const responseText = response.content.map(c => 'text' in c ? c.text : '').join('\n');
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const enhancedData = JSON.parse(jsonMatch[0]);
      
      // Merge the enhanced insights and recommendations with the original data
      const enhancedUserData = {
        ...userData,
        insights: [...userData.insights, ...(enhancedData.enhancedInsights || [])],
        recommendations: [...userData.recommendations, ...(enhancedData.personalizedRecommendations || [])]
      };
      
      return enhancedUserData;
    }
    
    // If we couldn't parse the response, return the original data
    console.warn('Failed to parse Claude response, returning original insights');
    return userData;
  } catch (error) {
    console.error('Error enhancing insights with Claude:', error);
    return userData; // Return original data on error
  }
}

function prepareDataSummary(userData: ProcessedUserData): string {
  // Extract the most relevant data points for Claude
  const { userId, records, correlations, stressFactors } = userData;
  
  // Get basic stats
  const recordCount = records.length;
  const avgStressLevel = records.reduce((sum, r) => sum + r.stress_level, 0) / recordCount;
  const avgScreenTime = records.reduce((sum, r) => sum + r.screen_time_total, 0) / recordCount;
  const avgPhysicalActivity = records.reduce(
    (sum, r) => sum + r.on_foot + r.on_bike + r.running, 
    0
  ) / recordCount;
  const avgConversations = records.reduce((sum, r) => sum + r.conversation_count, 0) / recordCount;
  
  // Format as readable text
  return `
User ID: ${userId}
Data records: ${recordCount} days of monitoring
Average stress level: ${avgStressLevel.toFixed(2)} (scale 1-5)
Average screen time: ${avgScreenTime.toFixed(2)} minutes per day
Average physical activity: ${(avgPhysicalActivity * 100).toFixed(2)}% of day
Average conversations: ${avgConversations.toFixed(2)} per day

Key correlations:
${correlations.map(c => `- ${c.factor1} and ${c.factor2}: ${c.description} (strength: ${c.correlationStrength.toFixed(2)})`).join('\n')}

Primary stress factors:
${stressFactors.map(f => `- ${f.factor}: ${f.description} (impact: ${f.impact.toFixed(2)})`).join('\n')}

Recent patterns:
- Stress levels: ${records.slice(-7).map(r => r.stress_level.toFixed(1)).join(', ')}
- Screen time: ${records.slice(-7).map(r => Math.round(r.screen_time_total)).join(', ')}
- Physical activity (% of day): ${records.slice(-7).map(r => ((r.on_foot + r.on_bike + r.running) * 100).toFixed(1)).join(', ')}
- Conversations: ${records.slice(-7).map(r => Math.round(r.conversation_count)).join(', ')}
`;
}