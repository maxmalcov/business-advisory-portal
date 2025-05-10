import { cn } from '@/lib/utils';

export function NotificationDot({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'absolute -right-1 -top-1 h-2 w-2 rounded-full bg-destructive',
        className,
      )}
    />
  );
}
