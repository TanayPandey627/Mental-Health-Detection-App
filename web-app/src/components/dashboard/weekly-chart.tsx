import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Metric } from "@/types";

export function WeeklyChart() {
  const { data: weeklyMetrics, isLoading } = useQuery<Metric[]>({
    queryKey: ['/api/metrics/1/weekly'],
  });

  if (isLoading) {
    return (
      <div className="h-36 animate-pulse flex items-end justify-between space-x-1">
        {Array(7).fill(0).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="bg-gray-200 h-24 w-6 rounded-t-md"></div>
            <div className="bg-gray-200 h-4 w-6 mt-1 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!weeklyMetrics || weeklyMetrics.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center">
        <p className="text-sm text-[hsl(var(--neutral-dark))]">No weekly data available</p>
      </div>
    );
  }

  // Get day abbreviations
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Create mock data if we don't have 7 days
  const chartData = Array(7).fill(null).map((_, index) => {
    const day = days[index];
    const metric = weeklyMetrics.find(m => new Date(m.date).getDay() === index);
    
    return {
      day,
      score: metric?.mentalScore || 0,
      isToday: new Date().getDay() === index
    };
  });

  return (
    <div className="h-36 flex items-end justify-between space-x-1">
      {chartData.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className={`${item.isToday ? 'bg-[hsl(var(--status-good))]' : 'bg-primary'} w-6 rounded-t-md`} 
            style={{ height: `${Math.max(item.score / 100 * 80, 10)}%` }}
          ></div>
          <div className="text-xs text-[hsl(var(--neutral-dark))] mt-1">{item.day}</div>
        </div>
      ))}
    </div>
  );
}
