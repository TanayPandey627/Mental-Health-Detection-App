import { Card } from "@/components/ui/card";
import { cn, formatTime, calculateProgress } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  status: string;
  statusColor: string;
  current: number | string;
  goal: number | string;
  progress: number;
  progressColor: string;
  trend: string;
  onClick: () => void;
}

export function MetricCard({
  title,
  icon: Icon,
  iconColor,
  iconBgColor,
  status,
  statusColor,
  current,
  goal,
  progress,
  progressColor,
  trend,
  onClick
}: MetricCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className={cn("p-2 rounded-lg mr-3", iconBgColor)}>
              <Icon className={iconColor} />
            </span>
            <h3 className="font-medium">{title}</h3>
          </div>
          <span className={cn("font-medium", statusColor)}>{status}</span>
        </div>
        
        <div className="flex justify-between text-sm text-[hsl(var(--neutral-dark))] mb-1">
          <span>Today: {current}</span>
          <span>Goal: {goal}</span>
        </div>
        
        <div className="w-full bg-[hsl(var(--neutral-medium))] rounded-full h-2 mb-3">
          <div 
            className={cn("h-2 rounded-full", progressColor)} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between">
          <div className="text-xs text-[hsl(var(--neutral-dark))]">Week: {trend}</div>
          <button 
            className="text-primary text-sm font-medium"
            onClick={onClick}
          >
            Details
          </button>
        </div>
      </div>
    </Card>
  );
}
