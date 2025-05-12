import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StatusCard } from "./status-card";
import { MetricCard } from "./metric-card";
import { formatTime, getStatusColor, getStatusText, calculateProgress, formatDate } from "@/lib/utils";
import { ActivitySquare, Moon, Smartphone, Volume2 } from "lucide-react";
import { Metric } from "@/types";

export function MetricsOverview() {
  const { data: metrics, isLoading } = useQuery<Metric>({
    queryKey: ['/api/metrics/1/latest'],
  });

  const today = new Date();
  
  if (isLoading) {
    return (
      <div className="px-4 py-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-[hsl(var(--neutral-darker))]">Your Mental Health</h2>
          <div className="text-sm text-[hsl(var(--neutral-dark))]">
            {formatDate(today)}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 animate-pulse">
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
              <div className="h-28 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!metrics) {
    return (
      <div className="px-4 py-5">
        <h2 className="text-xl font-semibold text-[hsl(var(--neutral-darker))] mb-4">Your Mental Health</h2>
        <p className="text-[hsl(var(--neutral-dark))]">No metrics data available.</p>
      </div>
    );
  }
  
  // Calculate status based on mental score
  const statusText = metrics.mentalScore >= 80 ? "Good" : 
                    metrics.mentalScore >= 60 ? "Fair" : "Poor";
  
  const statusDescription = 
    statusText === "Good" ? "Your mental wellbeing is good based on your recent patterns." :
    statusText === "Fair" ? "Your mental wellbeing is fair. Try to improve your daily habits." :
    "Your mental wellbeing needs attention. Consider consulting a professional.";
  
  return (
    <div className="px-4 py-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-[hsl(var(--neutral-darker))]">Your Mental Health</h2>
        <div className="text-sm text-[hsl(var(--neutral-dark))]">
          {formatDate(metrics.date)}
        </div>
      </div>
      
      <StatusCard 
        status={statusText} 
        score={metrics.mentalScore} 
        description={statusDescription} 
      />
      
      <div className="space-y-4">
        {/* Physical Activity Metric */}
        <MetricCard
          title="Physical Activity"
          icon={ActivitySquare}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
          status={getStatusText(metrics.physicalActivity, metrics.physicalActivityGoal)}
          statusColor={`text-[hsl(var(--${getStatusColor(metrics.physicalActivity, metrics.physicalActivityGoal)}))]`}
          current={`${metrics.physicalActivity} min`}
          goal={`${metrics.physicalActivityGoal} min`}
          progress={calculateProgress(metrics.physicalActivity, metrics.physicalActivityGoal)}
          progressColor={`bg-[hsl(var(--${getStatusColor(metrics.physicalActivity, metrics.physicalActivityGoal)}))]`}
          trend="+50%"
          onClick={() => {}}
        />
        
        {/* Sleep Metric */}
        <MetricCard
          title="Sleep"
          icon={Moon}
          iconColor="text-secondary"
          iconBgColor="bg-secondary/10"
          status={getStatusText(metrics.sleep, metrics.sleepGoal)}
          statusColor={`text-[hsl(var(--${getStatusColor(metrics.sleep, metrics.sleepGoal)}))]`}
          current={formatTime(metrics.sleep)}
          goal={formatTime(metrics.sleepGoal)}
          progress={calculateProgress(metrics.sleep, metrics.sleepGoal)}
          progressColor={`bg-[hsl(var(--${getStatusColor(metrics.sleep, metrics.sleepGoal)}))]`}
          trend="-10%"
          onClick={() => {}}
        />
        
        {/* Screen Time Metric */}
        <MetricCard
          title="Screen Time"
          icon={Smartphone}
          iconColor="text-accent"
          iconBgColor="bg-accent/10"
          status={getStatusText(metrics.screenTime, metrics.screenTimeGoal, true)}
          statusColor={`text-[hsl(var(--${getStatusColor(metrics.screenTime, metrics.screenTimeGoal, true)}))]`}
          current={formatTime(metrics.screenTime)}
          goal={`< ${formatTime(metrics.screenTimeGoal)}`}
          progress={calculateProgress(metrics.screenTime, metrics.screenTimeGoal, true)}
          progressColor={`bg-[hsl(var(--${getStatusColor(metrics.screenTime, metrics.screenTimeGoal, true)}))]`}
          trend="+25%"
          onClick={() => {}}
        />
        
        {/* Ambient Noise Metric */}
        <MetricCard
          title="Ambient Noise"
          icon={Volume2}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
          status={getStatusText(metrics.ambientNoise, metrics.ambientNoiseGoal, true)}
          statusColor={`text-[hsl(var(--${getStatusColor(metrics.ambientNoise, metrics.ambientNoiseGoal, true)}))]`}
          current={`${metrics.ambientNoise} dB`}
          goal={`< ${metrics.ambientNoiseGoal} dB`}
          progress={calculateProgress(metrics.ambientNoise, metrics.ambientNoiseGoal, true)}
          progressColor={`bg-[hsl(var(--${getStatusColor(metrics.ambientNoise, metrics.ambientNoiseGoal, true)}))]`}
          trend="-5%"
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
