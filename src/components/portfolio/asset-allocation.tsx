import PortfolioPieChart from '@/app/portfolio/donut-piechart';
import Box from '../ui/Box';
import DonutPieChart from '@/app/portfolio/donut-piechart';
import AllocationItem from './allocation-item';
import ContentTitle from './content-title';

const holdingsData = [
  { name: 'TSLA', amount: 100, value: 25, fill: '#EF4444' },
  { name: 'AAPL', amount: 100, value: 25, fill: '#3B82F6' },
  { name: 'NVDA', amount: 100, value: 25, fill: '#22C55E' },
  { name: 'PLTR', amount: 100, value: 25, fill: '#EAB308' },
];

const industryData = [
  { name: '전기차', value: 10, fill: '#EF4444' },
  { name: '자동차브랜드', value: 10, fill: '#ef9444' },
  { name: 'ESS', value: 10, fill: '#d1ee17' },
  { name: '태양광에너지', value: 10, fill: '#7def44' },
  { name: '스마트폰제조', value: 10, fill: '#3B82F6' },
  { name: '게임플랫폼', value: 10, fill: '#2a2d7c' },
  { name: '컴퓨터와주변기기', value: 20, fill: '#b83bf6' },
  { name: '반도체팹리스', value: 10, fill: '#f63b95' },
  { name: '인공지능', value: 10, fill: '#3bf6b5' },
  { name: '소프트웨어', value: 10, fill: '#22c5c5' },
];

const sectorsData = [
  { name: '전기자동차', value: 10, fill: '#EF4444' },
  { name: 'AI', value: 10, fill: '#ef9444' },
  { name: '반도체', value: 10, fill: '#d1ee17' },
  { name: '전자기기', value: 10, fill: '#7def44' },
  { name: '인공지능', value: 10, fill: '#3B82F6' },
  { name: '소프트웨어', value: 10, fill: '#2a2d7c' },
];

const themesData = [
  { name: '미국', value: 10, fill: '#3B82F6' },
  { name: '코스피', value: 10, fill: '#22C55E' },
  { name: '코스닥', value: 10, fill: '#EAB308' },
  { name: '해외', value: 10, fill: '#3B82F6' },
  { name: '현금', value: 10, fill: '#22C55E' },
];

export default function AssetAllocation() {
  return (
    <Box element="section" className="flex flex-col gap-5">
      <ContentTitle title="Asset Allocation / Sector Analysis" />
      <div className="flex gap-5 w-full">
        <div className="flex flex-col flex-1">
          <h3>Holdings</h3>
          <DonutPieChart data={holdingsData} />
          <div className="flex flex-col w-full gap-4">
            {holdingsData.map((item, index) => (
              <AllocationItem
                key={index}
                name={item.name}
                amount={item.amount}
                value={item.value}
                fill={item.fill}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <h3>Industries</h3>
          <DonutPieChart data={industryData} />
          <div className="flex flex-col w-full gap-4 h-[250px] overflow-y-auto overscroll-none">
            {industryData.map((item, index) => (
              <AllocationItem
                key={index}
                name={item.name}
                value={item.value}
                fill={item.fill}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <h3>Sectors</h3>
          <DonutPieChart
            data={[
              { name: 'TSLA', value: 100, fill: '#EF4444' },
              { name: 'AAPL', value: 100, fill: '#3B82F6' },
              { name: 'NVDA', value: 100, fill: '#22C55E' },
              { name: 'PLTR', value: 100, fill: '#EAB308' },
            ]}
          />
          <div className="flex flex-col w-full gap-4">
            {sectorsData.map((item, index) => (
              <AllocationItem
                key={index}
                name={item.name}
                value={item.value}
                fill={item.fill}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <h3>Themes</h3>
          <DonutPieChart
            data={[
              { name: 'TSLA', value: 100, fill: '#EF4444' },
              { name: 'AAPL', value: 100, fill: '#3B82F6' },
              { name: 'NVDA', value: 100, fill: '#22C55E' },
              { name: 'PLTR', value: 100, fill: '#EAB308' },
            ]}
          />
          <div className="flex flex-col w-full gap-4">
            {themesData.map((item, index) => (
              <AllocationItem
                key={index}
                name={item.name}
                value={item.value}
                fill={item.fill}
              />
            ))}
          </div>
        </div>
      </div>
      {/* <div style={{ display: 'flex', gap: '20px' }}> */}
      {/* Right (list + details) */}
      {/* <div style={{ flex: 2 }}>
          <div style={{ height: 40 }}>업종 비중 리스트</div>
          <div style={{ height: 40 }}>코스피/코스닥/해외 비중</div>
          <div style={{ height: 40 }}>현금 비중</div>
        </div> */}
      {/* </div> */}
    </Box>
  );
}
