import Image from 'next/image';
import Box from './ui/Box';
import Separator from './ui/Separator';
import { CircleFlag } from 'react-circle-flags';

export const Case = ({
  title,
  content,
  region,
  className,
}: {
  region: string;
  title: string;
  content: string;
  className?: string;
}) => {
  return (
    <Box className={`${className} flex-col h-[250px]`}>
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="truncate w-full text-center">{title}</h1>
        <Separator />
      </div>
      <div className="flex-1 flex overflow-scroll">
        <p className="text-sm">{content}</p>
        {/* <div className="w-[100px] h-[100px]">
          <Image
            src={`/flags/${region}.svg`}
            alt={region}
            width={100}
            height={100}
          />
        </div> */}
      </div>
      <div className="flex w-full justify-end gap-1">
        <CircleFlag countryCode={region} height={20} width={20} />
        <p className="text-sm uppercase">{region}</p>
      </div>
    </Box>
  );
};

export default function Events({
  items,
}: {
  items: { id: string; title: string; content: string; region: string }[];
}) {
  return (
    <div className="select-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {items.map((item) => (
        <Case
          key={item.id}
          title={item.title}
          content={item.content}
          className="col-span-1"
          region={item.region}
        />
      ))}
    </div>
  );
}
