import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WeeklyChart } from "./weekly-chart";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { User, Metric } from "@/types";
import { PersonStanding, Bell, ShieldCheck, HelpCircle, ChevronRight } from "lucide-react";

export function UserDashboard() {
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/user/1'],
  });

  const { data: latestMetrics, isLoading: metricsLoading } = useQuery<Metric>({
    queryKey: ['/api/metrics/1/latest'],
  });

  const isLoading = userLoading || metricsLoading;

  if (isLoading) {
    return (
      <div className="px-4 py-5">
        <div className="flex flex-col items-center mt-4 mb-6 animate-pulse">
          <div className="w-24 h-24 rounded-full bg-gray-200 mb-3"></div>
          <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-5">
            <h3 className="text-lg font-semibold mb-4">Mental Wellbeing Summary</h3>
            <div className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-36 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !latestMetrics) {
    return (
      <div className="px-4 py-5">
        <h2 className="text-xl font-semibold text-[hsl(var(--neutral-darker))] mb-4">Dashboard</h2>
        <p className="text-[hsl(var(--neutral-dark))]">User data not available.</p>
      </div>
    );
  }

  // Calculate 7-day average score (mock)
  const weekAvg = latestMetrics.mentalScore - 4;
  
  // Calculate trend percentage (mock)
  const trend = ((latestMetrics.mentalScore - weekAvg) / weekAvg * 100).toFixed(0);
  const trendDisplay = trend.startsWith('-') ? trend : `+${trend}%`;

  return (
    <div className="px-4 py-5">
      <div className="flex flex-col items-center mt-4 mb-6">
        {user.profileImage ? (
          <img 
            src={user.profileImage} 
            alt={`${user.displayName}'s profile`} 
            className="w-24 h-24 rounded-full mb-3 border-4 border-white shadow-sm object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mb-3 border-4 border-white shadow-sm bg-primary/10 flex items-center justify-center">
            <PersonStanding className="h-12 w-12 text-primary" />
          </div>
        )}
        <h2 className="text-xl font-semibold text-[hsl(var(--neutral-darker))]">{user.displayName}</h2>
        <p className="text-[hsl(var(--neutral-dark))]">Member since {formatDate(user.joinDate).split(',')[0]}</p>
      </div>
      
      {/* Mental Health Score Summary */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold mb-4">Mental Wellbeing Summary</h3>
          
          <div className="flex justify-between mb-6">
            <div className="text-center">
              <div className="text-primary text-2xl font-bold">{latestMetrics.mentalScore}</div>
              <div className="text-sm text-[hsl(var(--neutral-dark))]">Current</div>
            </div>
            <div className="text-center">
              <div className="text-[hsl(var(--neutral-darker))] text-2xl font-bold">{weekAvg}</div>
              <div className="text-sm text-[hsl(var(--neutral-dark))]">7-day Avg</div>
            </div>
            <div className="text-center">
              <div className="text-secondary text-2xl font-bold">{trendDisplay}</div>
              <div className="text-sm text-[hsl(var(--neutral-dark))]">Trend</div>
            </div>
          </div>
          
          {/* Weekly Trend Visualization */}
          <WeeklyChart />
        </CardContent>
      </Card>
      
      {/* Account Settings */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold p-5 border-b border-[hsl(var(--neutral-medium))]">Account Settings</h3>
        
        <div className="divide-y divide-[hsl(var(--neutral-medium))]">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <PersonStanding className="text-[hsl(var(--neutral-dark))] mr-3" size={20} />
              <span>Personal Information</span>
            </div>
            <ChevronRight className="text-[hsl(var(--neutral-dark))]" size={20} />
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="text-[hsl(var(--neutral-dark))] mr-3" size={20} />
              <span>Notifications</span>
            </div>
            <ChevronRight className="text-[hsl(var(--neutral-dark))]" size={20} />
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <ShieldCheck className="text-[hsl(var(--neutral-dark))] mr-3" size={20} />
              <span>Privacy & Data</span>
            </div>
            <ChevronRight className="text-[hsl(var(--neutral-dark))]" size={20} />
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <HelpCircle className="text-[hsl(var(--neutral-dark))] mr-3" size={20} />
              <span>Help & Support</span>
            </div>
            <ChevronRight className="text-[hsl(var(--neutral-dark))]" size={20} />
          </div>
        </div>
      </Card>
      
      {/* App Info */}
      <div className="text-center text-sm text-[hsl(var(--neutral-dark))] mb-8">
        <p>MindTrack v1.0.0</p>
        <p className="mt-1">© 2023 MindTrack Health Technologies</p>
      </div>
    </div>
  );
}
