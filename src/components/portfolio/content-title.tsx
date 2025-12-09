import { cn } from '@/lib/utils';

export default function ContentTitle({
  title,
  className,
}: {
  title: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn('text-2xl mb-4 text-black dark:text-white', className)}>
      {title}
    </h2>
  );
}
