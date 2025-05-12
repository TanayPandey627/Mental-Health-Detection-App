import { useState } from "react";
import { Activity, User, ClipboardList, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: TabProps[] = [
  {
    id: "metrics",
    label: "Metrics",
    icon: <Activity />,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <User />,
  },
  {
    id: "insights",
    label: "Insights",
    icon: <BarChart2 />,
  },
  {
    id: "survey",
    label: "Survey",
    icon: <ClipboardList />,
  },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[hsl(var(--neutral-medium))] shadow-sm z-10">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cn(
              "flex flex-col items-center justify-center py-2 px-4 w-1/4",
              activeTab === tab.id
                ? "text-primary border-t-2 border-primary"
                : "text-[hsl(var(--neutral-dark))]"
            )}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon}
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
