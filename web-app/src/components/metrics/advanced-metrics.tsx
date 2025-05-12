import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Activity, Moon, MessageCircle, Map, Brain } from "lucide-react";

export function AdvancedMetrics() {
  const today = new Date();
  
  // Mock data for advanced metrics (this would come from an API call in production)
  const advancedMetrics = {
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

  // Format time from seconds to hours and minutes
  const formatTimeFromSeconds = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours === 0) {
      return `${minutes} min`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="px-4 py-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-[hsl(var(--neutral-darker))]">Advanced Insights</h2>
        <div className="text-sm text-[hsl(var(--neutral-dark))]">
          {formatDate(today)}
        </div>
      </div>

      {/* Dark Time Card */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <span className="p-2 bg-[hsla(var(--neutral-darker),0.1)] rounded-lg mr-3">
                <Moon className="text-[hsl(var(--neutral-darker))]" size={20} />
              </span>
              <h3 className="font-medium">Phone in Dark</h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-[hsl(var(--primary))]">{advancedMetrics.darkTime.total.toFixed(1)}</p>
              <p className="text-xs text-[hsl(var(--neutral-dark))]">Total (min)</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[hsl(var(--primary))]">{advancedMetrics.darkTime.average.toFixed(1)}</p>
              <p className="text-xs text-[hsl(var(--neutral-dark))]">Average (min)</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[hsl(var(--primary))]">{advancedMetrics.darkTime.max.toFixed(1)}</p>
              <p className="text-xs text-[hsl(var(--neutral-dark))]">Max (min)</p>
            </div>
          </div>
          
          <p className="text-sm text-[hsl(var(--neutral-dark))]">
            Your phone spent over {Math.round(advancedMetrics.darkTime.total)} minutes in darkness today, 
            possibly in a pocket or bag. Extended dark periods may indicate less active usage or more focused activity.
          </p>
        </CardContent>
      </Card>

      {/* Conversations Card */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <span className="p-2 bg-[hsla(var(--secondary),0.1)] rounded-lg mr-3">
                <MessageCircle className="text-[hsl(var(--secondary))]" size={20} />
              </span>
              <h3 className="font-medium">Conversations</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-[hsl(var(--secondary))]">{advancedMetrics.conversation.count}</p>
              <p className="text-xs text-[hsl(var(--neutral-dark))]">Count</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[hsl(var(--secondary))]">{formatTimeFromSeconds(advancedMetrics.conversation.totalDuration)}</p>
              <p className="text-xs text-[hsl(var(--neutral-dark))]">Total Duration</p>
            </div>
          </div>
          
          <p className="text-sm text-[hsl(var(--neutral-dark))]">
            You had {advancedMetrics.conversation.count} conversations today with an average length of{" "}
            {Math.round(advancedMetrics.conversation.avgDuration/60)} minutes each. 
            Social interaction is associated with improved mental wellbeing.
          </p>
        </CardContent>
      </Card>

      {/* Activity Patterns Card */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <span className="p-2 bg-[hsla(var(--accent),0.1)] rounded-lg mr-3">
                <Activity className="text-[hsl(var(--accent))]" size={20} />
              </span>
              <h3 className="font-medium">Activity Patterns</h3>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-[hsl(var(--accent))]">{advancedMetrics.activities.onBike.toFixed(1)}%</p>
              <p className="text-xs text-[hsl(var(--neutral-dark))]">Biking</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[hsl(var(--accent))]">{advancedMetrics.activities.onFoot.toFixed(1)}%</p>
              <p className="text-xs text-[hsl(var(--neutral-dark))]">Walking</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[hsl(var(--accent))]">{advancedMetrics.activities.running.toFixed(1)}%</p>
              <p className="text-xs text-[hsl(var(--neutral-dark))]">Running</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[hsl(var(--accent))]">{advancedMetrics.activities.still.toFixed(1)}%</p>
              <p className="text-xs text-[hsl(var(--neutral-dark))]">Still</p>
            </div>
          </div>
          
          <div className="w-full h-6 bg-[hsl(var(--neutral-medium))] rounded-full mb-3 overflow-hidden flex">
            <div 
              className="h-full bg-[hsl(var(--primary))]" 
              style={{ width: `${advancedMetrics.activities.onBike}%` }}
            ></div>
            <div 
              className="h-full bg-[hsl(var(--secondary))]" 
              style={{ width: `${advancedMetrics.activities.onFoot}%` }}
            ></div>
            <div 
              className="h-full bg-[hsl(var(--accent))]" 
              style={{ width: `${advancedMetrics.activities.running}%` }}
            ></div>
            <div 
              className="h-full bg-[hsl(var(--neutral-dark))]" 
              style={{ width: `${advancedMetrics.activities.still}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-[hsl(var(--neutral-dark))]">
            You spent most of your day stationary ({advancedMetrics.activities.still}%), with some walking ({advancedMetrics.activities.onFoot}%) 
            and brief periods of running or cycling. More physical activity is linked to better mental health.
          </p>
        </CardContent>
      </Card>

      {/* Location Data Card */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <span className="p-2 bg-[hsla(var(--primary),0.1)] rounded-lg mr-3">
                <Map className="text-[hsl(var(--primary))]" size={20} />
              </span>
              <h3 className="font-medium">Location Insights</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-[hsl(var(--primary))]">{advancedMetrics.locations.totalDistance.toFixed(1)} km</p>
              <p className="text-xs text-[hsl(var(--neutral-dark))]">Total Distance</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[hsl(var(--primary))]">{advancedMetrics.locations.uniqueLocations}</p>
              <p className="text-xs text-[hsl(var(--neutral-dark))]">Unique Locations</p>
            </div>
          </div>
          
          <p className="text-sm text-[hsl(var(--neutral-dark))]">
            You visited {advancedMetrics.locations.uniqueLocations} different locations and traveled {advancedMetrics.locations.totalDistance.toFixed(1)} km today. 
            Environmental variety can stimulate mental engagement and reduce monotony.
          </p>
        </CardContent>
      </Card>

      {/* AI Insights Card */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <span className="p-2 bg-[hsla(var(--primary),0.1)] rounded-lg mr-3">
                <Brain className="text-[hsl(var(--primary))]" size={20} />
              </span>
              <h3 className="font-medium">AI-Generated Insights</h3>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-[hsl(var(--neutral-light))] rounded-lg">
              <p className="text-sm">
                <span className="font-semibold text-[hsl(var(--primary))]">• Pattern detected:</span> Your stress level increases on days with less physical activity and more screen time.
              </p>
            </div>
            
            <div className="p-3 bg-[hsl(var(--neutral-light))] rounded-lg">
              <p className="text-sm">
                <span className="font-semibold text-[hsl(var(--primary))]">• Recommendation:</span> Try to include at least 30 minutes of physical activity on high-stress days.
              </p>
            </div>
            
            <div className="p-3 bg-[hsl(var(--neutral-light))] rounded-lg">
              <p className="text-sm">
                <span className="font-semibold text-[hsl(var(--primary))]">• Correlation found:</span> More social conversations correlate with improved mental wellbeing scores in your data.
              </p>
            </div>
            
            <div className="p-3 bg-[hsl(var(--neutral-light))] rounded-lg">
              <p className="text-sm">
                <span className="font-semibold text-[hsl(var(--primary))]">• Suggestion:</span> Your optimal sleep duration appears to be 7-8 hours based on your mood patterns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}