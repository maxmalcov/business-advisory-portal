
import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export function NotificationBadge({ count, className }: NotificationBadgeProps) {
  if (count === 0) return null;

  return (
    <div 
      className={cn(
        "flex items-center justify-center h-5 min-w-5 text-xs font-medium rounded-full bg-destructive text-destructive-foreground",
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </div>
  );
}
