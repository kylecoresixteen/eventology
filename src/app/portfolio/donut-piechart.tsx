import { Pie, PieChart, Tooltip } from 'recharts';
import { TooltipIndex } from 'recharts/types/state/tooltipSlice';

export default function DonutPieChart({
  isAnimationActive = true,
  defaultIndex = undefined,
  data,
}: {
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
  data: Record<string, unknown>[] | undefined;
}) {
  return (
    <PieChart
      style={{
        width: '100%',
        maxWidth: '500px',
        maxHeight: '80vh',
        height: '200px',
        aspectRatio: 1,
        outline: 'none',
        border: 'none',
      }}
      responsive
    >
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius="60%"
        outerRadius="80%"
        fill="#8884d8"
        stroke="none"
        dataKey="value"
        isAnimationActive={isAnimationActive}
      />
      <Tooltip content={() => null} defaultIndex={defaultIndex} />
    </PieChart>
  );
}
