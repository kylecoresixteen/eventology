import { cn } from '@/lib/utils';

export default function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'border-t border-light-200/50 dark:border-dark-200/50 h-[1px] w-full',
        className,
      )}
    />
  );
}
