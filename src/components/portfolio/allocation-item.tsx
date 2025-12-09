interface AllocationItemProps {
  name: string;
  amount?: number;
  value: number;
  fill: string;
}

export default function AllocationItem({
  name,
  amount,
  value,
  fill,
}: AllocationItemProps) {
  return (
    <div className="flex flex-row w-full items-center">
      <span
        className="w-[20px] h-[20px] rounded-md mr-4"
        style={{ backgroundColor: fill }}
      />
      <div className="flex flex-col flex-1">
        <span>{name}</span>
        {amount && <span>{amount}$</span>}
      </div>
      <div className="mr-2">
        <span>{value}%</span>
      </div>
    </div>
  );
}
