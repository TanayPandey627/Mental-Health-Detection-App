import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  status: string;
  score: number;
  description: string;
}

export function StatusCard({ status, score, description }: StatusCardProps) {
  // Determine color based on status
  const colorClassName = 
    status === "Good" ? "text-[hsl(var(--status-good))]" :
    status === "Fair" ? "text-[hsl(var(--status-warning))]" :
    "text-[hsl(var(--status-poor))]";

  const progressColor = 
    status === "Good" ? "bg-[hsl(var(--status-good))]" :
    status === "Fair" ? "bg-[hsl(var(--status-warning))]" :
    "bg-[hsl(var(--status-poor))]";

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-[hsl(var(--neutral-dark))] mb-1">Current Status</h3>
            <div className={cn("text-xl font-semibold", colorClassName)}>{status}</div>
          </div>
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 rounded-full border-4 border-[hsl(var(--neutral-medium))] flex items-center justify-center">
              <span className="text-xl font-bold text-primary">{score}</span>
            </div>
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="46" 
                fill="none" 
                stroke={`hsl(var(--${status === "Good" ? "status-good" : status === "Fair" ? "status-warning" : "status-poor"}))`} 
                strokeWidth="8" 
                strokeDasharray={`${Math.min(score / 100 * 290, 290)} 290`} 
                strokeDashoffset="70"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <p className="text-sm text-[hsl(var(--neutral-dark))] mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}
