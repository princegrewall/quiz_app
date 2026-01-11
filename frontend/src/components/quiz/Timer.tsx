import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
  timeRemaining: number;
}

export function Timer({ timeRemaining }: TimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLow = timeRemaining < 300; // Less than 5 minutes
  const isCritical = timeRemaining < 60; // Less than 1 minute

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg font-display text-lg font-semibold transition-all duration-300",
        isCritical 
          ? "bg-destructive/20 text-destructive animate-timer-pulse" 
          : isLow 
            ? "bg-warning/20 text-warning"
            : "bg-secondary text-foreground"
      )}
    >
      <Clock className="w-5 h-5" />
      <span className="tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
