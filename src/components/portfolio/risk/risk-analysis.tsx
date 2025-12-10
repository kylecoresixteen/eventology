import Box from '../../ui/Box';
import AiReview from '../ai-review';
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
      <ContentTitle title="리스크 / 비중 분석" />

      <div className="flex gap-5 w-full">
        {/* 좌측: 상위 5개 비중 */}
        <div className="flex flex-col flex-1 p-5">
          <h2>상위 5개 종목 비중</h2>
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
            <h2>고변동성 종목 비중</h2>
            <HighVolatilityBar />
          </div>

          <div className="p-5">
            <h2>개별 종목 최대 손실</h2>
            <MaxLossTable />
          </div>
        </div>
      </div>
      <AiReview />
    </Box>
  );
}
