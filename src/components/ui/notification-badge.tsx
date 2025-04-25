
import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export function NotificationBadge({ count, className }: NotificationBadgeProps) {
  // Do not render anything if count is 0
  if (count === 0) return null;

  return (
    <div 
      className={cn(
        "absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 flex items-center justify-center min-w-[20px] h-[20px] text-xs font-bold rounded-full bg-destructive text-destructive-foreground",
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </div>
  );
}
