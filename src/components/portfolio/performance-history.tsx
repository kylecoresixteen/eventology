'use client';

import { useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Box from '../ui/Box';
import ContentTitle from './content-title';
import yearlyData from '@/data/portfolio-yearly-data.json';
import { cn } from '@/lib/utils';

type Period = '1m' | '3m' | 'ytd' | 'all';

interface DataPoint {
  date: number;
  closePercentage: number;
}

const periods: { label: string; value: Period }[] = [
  { label: '1개월', value: '1m' },
  { label: '3개월', value: '3m' },
  { label: 'YTD', value: 'ytd' },
  { label: '누계', value: 'all' },
];

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });
};

const formatPercentage = (value: number) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export default function PerformanceSection() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('all');
  const { theme } = useTheme();

  // 데이터 필터링
  const filteredData = useMemo(() => {
    const now = Date.now();
    let cutoffDate: number;

    switch (selectedPeriod) {
      case '1m':
        cutoffDate = now - 30 * 24 * 60 * 60 * 1000; // 30일 전
        break;
      case '3m':
        cutoffDate = now - 90 * 24 * 60 * 60 * 1000; // 90일 전
        break;
      case 'ytd':
        const currentYear = new Date().getFullYear();
        cutoffDate = new Date(currentYear, 0, 1).getTime(); // 올해 1월 1일
        break;
      case 'all':
      default:
        return yearlyData as DataPoint[];
    }

    return (yearlyData as DataPoint[]).filter(
      (point) => point.date >= cutoffDate,
    );
  }, [selectedPeriod]);

  // Y축 도메인 계산
  const yAxisDomain = useMemo(() => {
    if (filteredData.length === 0) return [-10, 10];

    const percentages = filteredData.map((d) => d.closePercentage ?? 0);
    const min = Math.min(...percentages);
    const max = Math.max(...percentages);

    const padding = Math.max(5, (max - min) * 0.1);
    return [
      Math.min(-5, Math.floor(min - padding)),
      Math.max(5, Math.ceil(max + padding)),
    ];
  }, [filteredData]);

  const tickColor =
    theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm text-black/70 dark:text-white/70 mb-1">
            {formatDate(data.date)}
          </p>
          <p
            className={cn(
              'text-sm font-semibold',
              data.closePercentage > 0
                ? 'text-green-500'
                : data.closePercentage < 0
                  ? 'text-red-500'
                  : '',
            )}
          >
            {formatPercentage(data.closePercentage)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Box element="section" className="flex flex-col w-full gap-5">
      <ContentTitle title="수익률 히스토리" />

      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={
                theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)'
              }
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: tickColor, fontSize: 12 }}
              stroke={
                theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.2)'
              }
            />
            <YAxis
              domain={yAxisDomain}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: tickColor, fontSize: 12 }}
              stroke={
                theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.2)'
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="closePercentage"
              stroke="#2EC87E"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-2">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => setSelectedPeriod(period.value)}
            className={cn(
              'px-3 py-1.5 text-sm font-semibold rounded-full transition-colors',
              selectedPeriod === period.value
                ? 'bg-white/10 dark:bg-white/10 text-black dark:text-white'
                : 'text-black/70 dark:text-white/70 hover:bg-white/5',
            )}
          >
            {period.label}
          </button>
        ))}
      </div>
    </Box>
  );
}
