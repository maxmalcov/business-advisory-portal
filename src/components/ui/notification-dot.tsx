
import { cn } from "@/lib/utils";

interface NotificationDotProps {
  show: boolean;
  className?: string;
}

export function NotificationDot({ show, className }: NotificationDotProps) {
  if (!show) return null;

  return (
    <div 
      className={cn(
        "absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive",
        className
      )}
    />
  );
}
