import Box from '../../ui/Box';
import AllocationItem from '../allocation-item';
import ContentTitle from '../content-title';
import HighVolatilityBar from './high-volatility-bar';
import MaxLossTable from './max-loss-table';
import Top5Pie from './top5pie';

export default function RiskSection() {
  const top5PieData = [
    { name: 'TSLA', value: 25, fill: '#EF4444' },
    { name: 'AAPL', value: 30, fill: '#3B82F6' },
    { name: 'NVDA', value: 20, fill: '#22C55E' },
    { name: 'PLTR', value: 25, fill: '#EAB308' },
  ];

  return (
    <Box element="section" className="flex flex-col gap-5">
      <ContentTitle title="Risk / Concentration Analysis" />

      <div className="flex gap-5 w-full">
        {/* 좌측: 상위 5개 비중 */}
        <div className="flex flex-col flex-1 p-5">
          <h2>Top 5 Holdings Weight</h2>
          <Top5Pie data={top5PieData} />
          <div className="flex flex-col w-full gap-4">
            {top5PieData.map((item, index) => (
              <AllocationItem
                key={index}
                name={item.name}
                value={item.value}
                fill={item.fill}
              />
            ))}
          </div>
        </div>

        {/* 우측: 두 개의 카드 */}
        <div className="flex flex-col flex-1 gap-5">
          <div className="p-5">
            <h2>High Volatility Holdings Weight</h2>
            <HighVolatilityBar />
          </div>

          <div className="p-5">
            <h2>Individual Maximum Loss</h2>
            <MaxLossTable />
          </div>
        </div>
      </div>
    </Box>
  );
}
