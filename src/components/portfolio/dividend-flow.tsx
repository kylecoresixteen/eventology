'use client';

import { useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Box from '../ui/Box';
import ContentTitle from './content-title';
import { cn } from '@/lib/utils';

// Mock 데이터 타입
interface DividendItem {
  id: string;
  symbol: string;
  companyName: string;
  amount: number;
  paymentDate: string;
}

interface MonthlyDividend {
  month: string;
  year: number;
  monthIndex: number;
  dividends: DividendItem[];
  totalAmount: number;
}

// 지금부터 1년 후까지의 배당 데이터 생성
const generateMockData = (): MonthlyDividend[] => {
  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  const symbols = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
    { symbol: 'V', name: 'Visa Inc.' },
    { symbol: 'JNJ', name: 'Johnson & Johnson' },
  ];

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const data: MonthlyDividend[] = [];

  // 현재 월부터 다음 해 12월까지 (약 1년)
  for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
    const year = currentYear + yearOffset;
    const startMonth = yearOffset === 0 ? currentMonth : 0;
    const endMonth = yearOffset === 0 ? 11 : currentMonth;

    for (let monthIndex = startMonth; monthIndex <= endMonth; monthIndex++) {
      // 각 월마다 랜덤하게 0-5개의 배당 데이터 생성
      const dividendCount = Math.floor(Math.random() * 6);
      const selectedSymbols = symbols
        .sort(() => Math.random() - 0.5)
        .slice(0, dividendCount);

      const dividends: DividendItem[] = selectedSymbols.map((stock, idx) => {
        const amount = Math.floor(Math.random() * 100000 + 10000); // 10,000원 ~ 110,000원
        const day = Math.floor(Math.random() * 28) + 1; // 1일 ~ 28일

        return {
          id: `${year}-${monthIndex}-${idx}`,
          symbol: stock.symbol,
          companyName: stock.name,
          amount,
          paymentDate: `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        };
      });

      const totalAmount = dividends.reduce((sum, d) => sum + d.amount, 0);

      data.push({
        month: months[monthIndex],
        year,
        monthIndex,
        dividends,
        totalAmount,
      });
    }
  }

  return data;
};

export default function DividendSection() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { theme } = useTheme();
  const monthlyData = useMemo(() => generateMockData(), []);

  // 선택된 연도의 데이터만 필터링
  const yearData = useMemo(
    () => monthlyData.filter((data) => data.year === selectedYear),
    [monthlyData, selectedYear],
  );

  // 바 차트용 데이터 (월별 총 배당금액)
  const chartData = useMemo(() => {
    return yearData.map((data) => ({
      month: data.month,
      amount: data.totalAmount,
    }));
  }, [yearData]);

  // 모든 배당을 시간순으로 정렬
  const allDividends = useMemo(() => {
    const dividends: (DividendItem & { month: string; year: number })[] = [];
    yearData.forEach((monthData) => {
      monthData.dividends.forEach((dividend) => {
        dividends.push({
          ...dividend,
          month: monthData.month,
          year: monthData.year,
        });
      });
    });
    return dividends.sort(
      (a, b) =>
        new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime(),
    );
  }, [yearData]);

  // 총 배당금액 계산
  const totalAmount = useMemo(
    () => yearData.reduce((sum, data) => sum + data.totalAmount, 0),
    [yearData],
  );

  // 사용 가능한 연도 목록
  const availableYears = useMemo(() => {
    const years = new Set(monthlyData.map((data) => data.year));
    return Array.from(years).sort();
  }, [monthlyData]);

  const formatCurrency = (amount: number) => {
    return (
      new Intl.NumberFormat('ko-KR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount) + '원'
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  };

  const tickColor =
    theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm text-black/70 dark:text-white/70 mb-1">
            {payload[0].payload.month}
          </p>
          <p className="text-sm font-semibold text-black dark:text-white">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const handlePrevYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex > 0) {
      setSelectedYear(availableYears[currentIndex - 1]);
    }
  };

  const handleNextYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex < availableYears.length - 1) {
      setSelectedYear(availableYears[currentIndex + 1]);
    }
  };

  return (
    <Box element="section" className="flex flex-col w-full gap-5">
      <ContentTitle title="배당 / 현금 흐름" />

      {/* 연도 선택 및 총 배당금액 */}
      <div className="flex items-center flex-col justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevYear}
            disabled={availableYears.indexOf(selectedYear) === 0}
            className={cn(
              'p-1 rounded-lg transition-colors',
              availableYears.indexOf(selectedYear) === 0
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-white/5',
            )}
          >
            <ChevronLeft size={20} className="text-black dark:text-white" />
          </button>
          <div className="text-xl font-semibold text-black dark:text-white">
            {selectedYear}년
          </div>
          <button
            onClick={handleNextYear}
            disabled={
              availableYears.indexOf(selectedYear) === availableYears.length - 1
            }
            className={cn(
              'p-1 rounded-lg transition-colors',
              availableYears.indexOf(selectedYear) === availableYears.length - 1
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-white/5',
            )}
          >
            <ChevronRight size={20} className="text-black dark:text-white" />
          </button>
        </div>
        <div className="text-xl font-bold text-black dark:text-white">
          {formatCurrency(totalAmount)}
        </div>
      </div>

      {/* 월별 배당 바 차트 */}
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
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
              dataKey="month"
              tick={{ fill: tickColor, fontSize: 12 }}
              stroke={
                theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.2)'
              }
            />
            <YAxis
              tick={{ fill: tickColor, fontSize: 12 }}
              stroke={
                theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.2)'
              }
            />
            <Tooltip
              content={<CustomTooltip />}
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1a1a1a' : '#2a2a2a',
                border: 'none',
                borderRadius: '8px',
              }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            />
            <Bar dataKey="amount" fill="#c6d1cc" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 배당 리스트 (월별 그룹화) */}
      <div className="flex flex-col gap-4 h-[300px] overflow-y-auto overscroll-none">
        {yearData.length === 0 ? (
          <div className="text-center py-8 text-black/50 dark:text-white/50">
            {selectedYear}년 예정된 배당이 없습니다.
          </div>
        ) : (
          yearData.map((monthData) => {
            if (monthData.dividends.length === 0) return null;

            return (
              <div key={`${monthData.year}-${monthData.monthIndex}`}>
                <div className="flex items-center justify-between mb-2 px-2">
                  <div className="text-lg font-semibold text-black dark:text-white">
                    {monthData.month}
                  </div>
                  <div className="text-sm text-black/70 dark:text-white/70">
                    {formatCurrency(monthData.totalAmount)}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {monthData.dividends.map((dividend) => (
                    <div
                      key={dividend.id}
                      className="bg-white/5 dark:bg-white/5 border border-light-200/50 dark:border-dark-200/50 rounded-xl p-4 hover:bg-white/8 dark:hover:bg-white/8 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="font-bold text-lg text-black dark:text-white">
                              {dividend.symbol}
                            </div>
                            <div className="text-sm text-black/70 dark:text-white/70">
                              {dividend.companyName}
                            </div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-black dark:text-white">
                          {formatCurrency(dividend.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Box>
  );
}
