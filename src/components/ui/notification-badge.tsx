
import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count: number;
  className?: string;
  position?: 'top-right' | 'default';
}

export function NotificationBadge({ 
  count, 
  className, 
  position = 'default' 
}: NotificationBadgeProps) {
  if (count === 0) return null;

  const positionClasses = {
    'default': '',
    'top-right': 'absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 text-xs'
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-center h-5 min-w-5 font-medium rounded-full bg-destructive text-destructive-foreground",
        positionClasses[position],
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </div>
  );
}
