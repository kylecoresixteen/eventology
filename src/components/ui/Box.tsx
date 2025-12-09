import { cn } from '@/lib/utils';

export default function Box({
  element = 'div',
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
  element?: 'div' | 'section';
}) {
  if (element === 'section') {
    return (
      <section
        className={cn(
          'bg-light-secondary dark:bg-dark-secondary rounded-2xl border border-light-200 dark:border-dark-200 shadow-sm shadow-light-200/10 dark:shadow-black/25 flex items-center w-full p-4 gap-3',
          className,
        )}
      >
        {children}
      </section>
    );
  }
  return (
    <div
      className={cn(
        'bg-light-secondary dark:bg-dark-secondary rounded-2xl border border-light-200 dark:border-dark-200 shadow-sm shadow-light-200/10 dark:shadow-black/25 flex items-center w-full p-4 gap-3',
        className,
      )}
    >
      {children}
    </div>
  );
}
