import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  }
  
  return `${hours}${mins > 0 ? `.${Math.floor((mins / 60) * 10)}` : ''} hrs`;
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getStatusColor(value: number, goal: number, isReversed: boolean = false): string {
  const percentage = isReversed 
    ? (goal / value) * 100 
    : (value / goal) * 100;
  
  if (isReversed) {
    if (percentage >= 100) return "status-good";
    if (percentage >= 75) return "status-warning";
    return "status-poor";
  } else {
    if (percentage >= 90) return "status-good";
    if (percentage >= 60) return "status-warning";
    return "status-poor";
  }
}

export function getStatusText(value: number, goal: number, isReversed: boolean = false): string {
  const percentage = isReversed 
    ? (goal / value) * 100 
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

export function calculateProgress(value: number, goal: number, isReversed: boolean = false): number {
  if (isReversed) {
    // For metrics where lower is better (screen time, noise)
    return Math.min(100, (goal / Math.max(value, 1)) * 100);
  } else {
    // For metrics where higher is better (physical activity, sleep)
    return Math.min(100, (value / goal) * 100);
  }
}
