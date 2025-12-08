import { cn } from '@/lib/utils';

export default function Box({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'bg-light-secondary dark:bg-dark-secondary rounded-2xl border border-light-200 dark:border-dark-200 shadow-sm shadow-light-200/10 dark:shadow-black/25 flex items-center w-full px-3 py-2 gap-3',
        className,
      )}
    >
      {children}
    </div>
  );
}
