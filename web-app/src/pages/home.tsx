import { useState } from "react";
import { Header } from "@/components/layout/header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { MetricsOverview } from "@/components/metrics/metrics-overview";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { DailySurvey } from "@/components/survey/daily-survey";
import { AdvancedMetrics } from "@/components/metrics/advanced-metrics";

export default function Home() {
  const [activeTab, setActiveTab] = useState("metrics");

  return (
    <div className="min-h-screen bg-[hsl(var(--neutral-light))]">
      <Header />
      
      <main className="pt-14 pb-20">
        {activeTab === "metrics" && <MetricsOverview />}
        {activeTab === "dashboard" && <UserDashboard />}
        {activeTab === "insights" && <AdvancedMetrics />}
        {activeTab === "survey" && <DailySurvey />}
      </main>
      
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
    </div>
  );
}
