import Box from './ui/Box';

export const Article = ({
  title,
  content,
  className,
}: {
  className?: string;
  title: string;
  content: string;
}) => {
  return (
    <Box className={`${className} flex-col`}>
      <h1 className="text-lg font-medium">{title}</h1>
      <p className="text-black/70 dark:text-white/70 text-sm">{content}</p>
    </Box>
  );
};

export default function InsightArticles({
  items,
}: {
  items: { id: string; title: string; content: string }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
      {items.map((item) => (
        <Article
          key={item.id}
          title={item.title}
          content={item.content}
          className="col-span-1"
        />
      ))}
    </div>
  );
}
