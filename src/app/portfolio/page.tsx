'use client';

import AssetAllocation from '@/components/portfolio/asset-allocation';
import DividendFlow from '@/components/portfolio/dividend-flow';
import PerformanceHistory from '@/components/portfolio/performance-history';
import RiskAnalysis from '@/components/portfolio/risk/risk-analysis';
import SummarySection from '@/components/portfolio/summary-section';
import Box from '@/components/ui/Box';
import { cn } from '@/lib/utils';
import { Tab, TabGroup, TabList, TabPanel } from '@headlessui/react';
import { PieChartIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CompareChart from './compare-chart';
import TabContainer from './tab-container';

export interface Discover {
  title: string;
  content: string;
  url: string;
  thumbnail: string;
}

const topics: { key: string; display: string }[] = [
  {
    display: 'Tech & Science',
    key: 'tech',
  },
  {
    display: 'Finance',
    key: 'finance',
  },
  {
    display: 'Art & Culture',
    key: 'art',
  },
  {
    display: 'Sports',
    key: 'sports',
  },
  {
    display: 'Entertainment',
    key: 'entertainment',
  },
];

const categories = [
  {
    name: '보유종목',
  },
  {
    name: '분석',
  },
];

const chart_intervals = [
  {
    name: '7일',
    value: '1w',
  },
  {
    name: '1개월',
    value: '1m',
  },
  {
    name: '3개월',
    value: '3m',
  },
  {
    name: '연초 누계',
    value: '연초 누계',
  },
  {
    name: '1년',
    value: '1y',
  },
];

const Page = () => {
  const [discover, setDiscover] = useState<Discover[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState<string>(topics[0].key);
  const [hoverData, setHoverData] = useState<{
    date: number;
    closePercentage: number;
    reinvestClosePercentage: number;
    differencePercentage: number;
  } | null>(null);

  const fetchArticles = async (topic: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/discover?topic=${topic}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      data.blogs = data.blogs.filter((blog: Discover) => blog.thumbnail);

      setDiscover(data.blogs);
    } catch (err: any) {
      console.error('Error fetching data:', err.message);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(activeTopic);
  }, [activeTopic]);

  return (
    <>
      <div className="text-black/70 dark:text-white/70">
        <div className="flex flex-col pt-10 border-b border-light-200/20 dark:border-dark-200/20 pb-6 px-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center justify-center">
              <PieChartIcon size={45} className="mb-2.5" />
              <h1
                className="text-5xl text-black dark:text-white font-normal p-2"
                style={{ fontFamily: 'PP Editorial, serif' }}
              >
                Portfolio Analysis
              </h1>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-row items-center justify-center min-h-screen">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-light-200 fill-light-secondary dark:text-[#202020] animate-spin dark:fill-[#ffffff3b]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100.003 78.2051 78.1951 100.003 50.5908 100C22.9765 99.9972 0.997224 78.018 1 50.4037C1.00281 22.7993 22.8108 0.997224 50.4251 1C78.0395 1.00281 100.018 22.8108 100 50.4251ZM9.08164 50.594C9.06312 73.3997 27.7909 92.1272 50.5966 92.1457C73.4023 92.1642 92.1298 73.4365 92.1483 50.6308C92.1669 27.8251 73.4392 9.0973 50.6335 9.07878C27.8278 9.06026 9.10003 27.787 9.08164 50.594Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4037 97.8624 35.9116 96.9801 33.5533C95.1945 28.8227 92.871 24.3692 90.0681 20.348C85.6237 14.1775 79.4473 9.36872 72.0454 6.45794C64.6435 3.54717 56.3134 2.65431 48.3133 3.89319C45.869 4.27179 44.3768 6.77534 45.014 9.20079C45.6512 11.6262 48.1343 13.0956 50.5786 12.717C56.5073 11.8281 62.5542 12.5399 68.0406 14.7911C73.527 17.0422 78.2187 20.7487 81.5841 25.4923C83.7976 28.5886 85.4467 32.059 86.4416 35.7474C87.1273 38.1189 89.5423 39.6781 91.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : (
          <>
            <TabContainer categories={categories}>
              <>
                <TabPanel key={categories[0].name} className="w-full">
                  <div className="flex flex-col gap-8 w-full">
                    <SummarySection />
                    <div className="flex gap-4 w-full">
                      <Box className="flex flex-1 flex-col gap-4">
                        <div className="flex w-full justify-between items-center">
                          <div className="flex flex-row gap-10 text-black dark:text-white">
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center gap-2">
                                <span className="bg-[#2EC87E] w-[10px] h-[3px]" />
                                <span>포트폴리오</span>
                              </div>
                              <div
                                className={cn(
                                  'text-sm font-semibold',
                                  (hoverData?.closePercentage ?? 0) === 0 && '',
                                  (hoverData?.closePercentage ?? 0) > 0
                                    ? 'text-green-500'
                                    : (hoverData?.closePercentage ?? 0) < 0
                                      ? 'text-red-500'
                                      : '',
                                )}
                              >
                                {(hoverData?.closePercentage ?? 0) > 0
                                  ? '+'
                                  : ''}
                                {(hoverData?.closePercentage ?? 0).toFixed(2)}%
                              </div>
                            </div>
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center gap-2">
                                <span className="bg-[#8C9096] w-[10px] h-[3px]" />
                                <span>S&P 500 (미국)</span>
                              </div>
                              <div
                                className={cn(
                                  'text-sm font-semibold',
                                  (hoverData?.differencePercentage ?? 0) ===
                                    0 && '',
                                  (hoverData?.differencePercentage ?? 0) > 0
                                    ? 'text-green-500'
                                    : (hoverData?.differencePercentage ?? 0) < 0
                                      ? 'text-red-500'
                                      : '',
                                )}
                              >
                                {(hoverData?.differencePercentage ?? 0) > 0
                                  ? '+'
                                  : ''}
                                {(hoverData?.differencePercentage ?? 0).toFixed(
                                  2,
                                )}
                                %
                              </div>
                            </div>
                          </div>
                          <TabGroup>
                            <TabList className="flex gap-4">
                              {chart_intervals.map(({ name }) => (
                                <Tab
                                  key={name}
                                  className="text-black dark:text-white focus:outline-none rounded-full px-3 text-sm/6 font-semibold text-white focus:outline-none hover:bg-white/5 data-[selected]:bg-white/10 data-[selected]:hover:bg-white/10 transition-colors"
                                >
                                  {name}
                                </Tab>
                              ))}
                            </TabList>
                            {/* <TabPanels className="mt-3">
                            <TabPanel key={categories[0].name}>
                              <Button className="focus:outline-none rounded-full px-3 py-1 text-sm/6 font-semibold text-white focus:outline-none hover:bg-white/5 data-[selected]:bg-white/10 data-[selected]:hover:bg-white/10 transition-colors" />
                            </TabPanel>
                          </TabPanels> */}
                          </TabGroup>
                        </div>
                        {/* TODO: Chart, Hover items, tabs 병합 */}
                        <CompareChart onHover={setHoverData} />
                      </Box>
                      <Box className="w-[300px]">
                        포트폴리오 평가 넣을 건지 결정 필요
                      </Box>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel
                  key={categories[1].name}
                  className="flex flex-col gap-6"
                >
                  {/* 자산 배분 / 섹터 분석 */}
                  <AssetAllocation />
                  {/* 리스크 / 집중도 분석 */}
                  <RiskAnalysis />
                  <div className="flex w-full gap-6">
                    {/* 수익률 히스토리 */}
                    <div className="flex flex-1">
                      <PerformanceHistory />
                    </div>
                    <div className="flex flex-1">
                      {/* 배당 현금 흐름 */}
                      <DividendFlow />
                    </div>
                  </div>
                </TabPanel>
              </>
            </TabContainer>
          </>
        )}
      </div>
    </>
  );
};

export default Page;
