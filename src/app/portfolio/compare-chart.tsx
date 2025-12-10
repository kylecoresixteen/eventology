import { FC, useMemo, useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import {
  Area,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import { throttle } from 'es-toolkit/function';
import yearlyData from '@/data/portfolio-yearly-data.json';

const formatPercentage = (n: number) => {
  const sign = n >= 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}%`;
};

const getDataKeyClosePercentage = (point: any) => point.closePercentage;
const getDataKeyReinvestClosePercentage = (point: any) =>
  point.reinvestClosePercentage;

// 각 데이터 포인트에 퍼센티지 값 추가 (첫 번째 값 대비 변화율)
type DataPointWithPercentage = {
  date: number;
  close: number;
  maxClose: number;
  reinvestClose?: number;
  netDeposits?: number;
  percentage?: number;
  closePercentage: number;
  reinvestClosePercentage: number;
  netDepositsPercentage: number;
};

// 1년치 데이터 사용 (JSON 파일에서 import)
const data = yearlyData as DataPointWithPercentage[];
// #endregion

const color = '#2EC87E';
const compareColor = '#8C9096';

// 수익률 기준으로 y축 계산
const { yAxisMin, yAxisMax } = data.reduce(
  (acc: { yAxisMin: number; yAxisMax: number }, val: (typeof data)[0]) => {
    const cp = val.closePercentage ?? 0;
    const rcp = val.reinvestClosePercentage ?? 0;

    return {
      yAxisMin: Math.min(acc.yAxisMin, cp, rcp),
      yAxisMax: Math.max(acc.yAxisMax, cp, rcp),
    };
  },
  { yAxisMin: Infinity, yAxisMax: -Infinity },
);

// y축 domain을 딱 떨어지는 숫자로 반올림
const roundToNearest = (value: number, nearest: number) => {
  return Math.round(value / nearest) * nearest;
};

const yAxisDomainRaw = [
  yAxisMin === Infinity ? -10 : Math.min(-10, yAxisMin - 5),
  yAxisMax === -Infinity ? 10 : Math.max(10, yAxisMax + 5),
];

const yAxisDomain = [
  roundToNearest(yAxisDomainRaw[0], 5),
  roundToNearest(yAxisDomainRaw[1], 5),
];

// y축 틱을 딱 떨어지는 숫자로 설정 (0% 항상 포함, 최소값 포함)
const yAxisTicks = (() => {
  const ticks: number[] = [];
  // 0%를 항상 포함
  if (yAxisDomain[0] <= 0 && yAxisDomain[1] >= 0) {
    ticks.push(0);
  }
  // 최소값 추가 (0%가 아니고 domain 범위 내인 경우)
  if (yAxisDomain[0] !== 0 && yAxisDomain[0] < 0) {
    ticks.push(yAxisDomain[0]);
  }
  // 최대값 추가 (0%가 아니고 domain 범위 내인 경우)
  if (yAxisDomain[1] !== 0 && yAxisDomain[1] > 0) {
    ticks.push(yAxisDomain[1]);
  }
  // 정렬
  return ticks.sort((a, b) => a - b);
})();

const compareHoverDenominator = data.filter(
  (d: (typeof data)[0]) => !!d.reinvestClose,
).length;

interface CompareChartProps {
  onHover?: (
    hoverData: {
      date: number;
      closePercentage: number;
      reinvestClosePercentage: number;
      differencePercentage: number;
    } | null,
  ) => void;
}

const CompareChart: FC<CompareChartProps> = ({ onHover }) => {
  const [hoverIndex, setHoverIndex] = useState(-1);
  const { theme } = useTheme();

  const isHovering = hoverIndex !== -1;

  // 데이터에서 각 달의 첫 번째 날짜를 찾아서 틱으로 사용
  const monthlyTicks = useMemo(() => {
    if (data.length === 0) return [];

    const ticks: number[] = [];
    let lastMonth = -1;
    let lastYear = -1;

    // 데이터를 순회하면서 각 달의 첫 번째 날짜를 찾음
    for (const point of data) {
      if (!point?.date) continue;
      const date = new Date(point.date);
      const month = date.getMonth();
      const year = date.getFullYear();

      // 새로운 달이 시작되면 틱 추가
      if (year !== lastYear || month !== lastMonth) {
        ticks.push(point.date);
        lastYear = year;
        lastMonth = month;
      }
    }

    return ticks;
  }, []);

  // XAxis domain 계산 - 첫 번째 틱이 항상 포함되도록 domain을 약간 확장
  const xAxisDomain = useMemo(() => {
    if (data.length === 0 || monthlyTicks.length === 0) {
      return [data[0]?.date ?? 0, data[data.length - 1]?.date ?? 0];
    }

    const firstTick = monthlyTicks[0];
    const lastDataPoint = data[data.length - 1]?.date ?? 0;
    const firstDataPoint = data[0]?.date ?? 0;

    // 첫 번째 틱이 domain 내부에 확실히 포함되도록 충분한 여유를 둠
    // Recharts가 경계 틱을 필터링하지 않도록 5% 여유 확보
    const range = lastDataPoint - firstDataPoint;
    const domainStart = firstTick - range * 0.05;

    const domain = [domainStart, lastDataPoint];

    return domain;
  }, [monthlyTicks]);

  // onHover와 hoverIndex를 ref로 저장하여 최신 값을 유지
  const onHoverRef = useRef(onHover);
  const hoverIndexRef = useRef(hoverIndex);

  useEffect(() => {
    onHoverRef.current = onHover;
  }, [onHover]);

  useEffect(() => {
    hoverIndexRef.current = hoverIndex;
  }, [hoverIndex]);

  // throttled 함수를 ref로 관리하여 한 번만 생성
  const throttledOnHoverRef = useRef(
    throttle(() => {
      if (onHoverRef.current) {
        const currentHoverIndex = hoverIndexRef.current;
        const isCurrentlyHovering = currentHoverIndex !== -1;
        if (
          isCurrentlyHovering &&
          currentHoverIndex >= 0 &&
          data[currentHoverIndex]
        ) {
          const hoverData = data[currentHoverIndex];
          const closePercentage = hoverData.closePercentage ?? 0;
          const reinvestClosePercentage =
            hoverData.reinvestClosePercentage ?? 0;
          const differencePercentage =
            closePercentage - reinvestClosePercentage;
          onHoverRef.current({
            date: hoverData.date,
            closePercentage,
            reinvestClosePercentage,
            differencePercentage,
          });
        }
      }
    }, 30),
  );

  // 호버 데이터를 부모에게 전달
  useEffect(() => {
    throttledOnHoverRef.current();
  }, [hoverIndex]);

  // 데이터 콘솔 로그
  useEffect(() => {
    console.log('Chart Data:', data);
    console.log('Data Length:', data.length);
    if (data.length > 0) {
      console.log('First Data Point:', data[0]);
      console.log('Last Data Point:', data[data.length - 2]);
    }
  }, []);

  // 다크모드에 따른 라벨 색상 (text-black/70 dark:text-white/70)
  const tickColor =
    theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';

  const invalidCompareValueLength = data
    .slice(0, hoverIndex)
    .filter((d: (typeof data)[0]) => !d.reinvestClose).length;
  const compareHoverNumerator = hoverIndex - invalidCompareValueLength;
  const compareHoverPercentage =
    // eslint-disable-next-line no-nested-ternary
    compareHoverDenominator > 0
      ? hoverIndex >= 0
        ? (compareHoverNumerator / compareHoverDenominator) * 100
        : 100
      : // handle the case of no valid data points. This only happens when the
        // chart has only 2 data points.
        compareHoverNumerator === 0
        ? 0
        : 100;
  const hoverPercentage =
    hoverIndex >= 0
      ? (hoverIndex /
          (data.filter((d: (typeof data)[0]) => !!d.date).length - 1)) *
        100
      : 100;
  const compareValue = data[hoverIndex]?.reinvestClose;

  // Area baseValue 계산 (수익률 기준)
  const areaBaseValue = useMemo(() => {
    const { yAxisMin: dynamicYAxisMin } = data.reduce(
      (acc, val) => {
        const cp = val.closePercentage ?? 0;
        const rcp = val.reinvestClosePercentage ?? 0;
        return {
          yAxisMin: Math.min(acc.yAxisMin, cp, rcp),
          yAxisMax: Math.max(acc.yAxisMax, cp, rcp),
        };
      },
      { yAxisMin: Infinity, yAxisMax: -Infinity },
    );
    return dynamicYAxisMin === Infinity
      ? -10
      : Math.min(-10, dynamicYAxisMin - 5);
  }, []);

  const handleMouseMove = useMemo(
    () =>
      ({ activeIndex }: any) => {
        // activeIndex가 유효한 경우에만 업데이트 (차트 영역을 벗어나면 undefined가 됨)
        if (
          activeIndex !== undefined &&
          activeIndex !== null &&
          activeIndex >= 0
        ) {
          setHoverIndex(Number(activeIndex));
        }
      },
    [],
  );

  const referenceLineSegment = useMemo(
    () =>
      [
        {
          x: data[hoverIndex]?.date ?? '',
          y: compareValue ?? data[hoverIndex]?.close ?? 0,
        },
        {
          x: data[hoverIndex]?.date ?? '',
          y: data[hoverIndex]?.close ?? compareValue ?? 0,
        },
      ] as const,
    [hoverIndex, compareValue],
  );

  // 날짜 표시 위치 계산
  const datePosition = useMemo(() => {
    if (!isHovering || hoverIndex < 0 || !data[hoverIndex]) return null;

    const firstDate = data[0]?.date ?? 0;
    const lastDate = data[data.length - 1]?.date ?? 0;
    const currentDate = data[hoverIndex].date;

    if (lastDate === firstDate) return null;

    const percentage =
      ((currentDate - firstDate) / (lastDate - firstDate)) * 100;

    return percentage;
  }, [isHovering, hoverIndex]);

  return (
    <div className="relative w-full">
      {/* 날짜 표시 - 차트 위에 표시 */}
      {hoverIndex >= 0 && data[hoverIndex] && datePosition !== null && (
        <div
          className="absolute top-0 pointer-events-none z-20"
          style={{
            left: `calc(6px + ${datePosition}% * (100% - 12px) / 100%)`,
            transform: 'translateX(-50%)',
            backgroundColor: 'rgb(138, 138, 138)',
          }}
        >
          <span className="text-sm font-medium px-2 py-1 rounded whitespace-nowrap text-black/70 dark:text-white/70">
            {new Date(data[hoverIndex].date).toLocaleDateString('ko-KR', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      )}
      <ComposedChart
        style={{ width: '100%', height: 300 }}
        responsive
        data={data}
        // Leave enough space to render the active dot
        // margin={{ left: 6, right: 6 }}
        onMouseMove={handleMouseMove}
      >
        <defs>
          <linearGradient id="portfolioColor" x1="0%" y1="0" x2="100%" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop
              offset={`${hoverPercentage}%`}
              stopColor={color}
              stopOpacity={1}
            />
            <stop
              offset={`${hoverPercentage}%`}
              stopColor={color}
              stopOpacity={0.3}
            />
            <stop offset="100%" stopColor={color} stopOpacity={0.3} />
          </linearGradient>
          <linearGradient
            id="compareValueColor"
            x1="0%"
            y1="0"
            x2="100%"
            y2="0"
          >
            <stop offset="0%" stopColor={compareColor} stopOpacity={1} />
            <stop
              offset={`${compareHoverPercentage}%`}
              stopColor={compareColor}
              stopOpacity={1}
            />
            <stop
              offset={`${compareHoverPercentage}%`}
              stopColor={compareColor}
              stopOpacity={0.3}
            />
            <stop offset="100%" stopColor={compareColor} stopOpacity={0.3} />
          </linearGradient>
          {/* Portfolio value 라인 아래 그라디언트 */}
          <linearGradient
            id="portfolioAreaGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="80%"
          >
            <stop offset="0%" stopColor={color} stopOpacity={0.6} />
            <stop offset="50%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis
          style={{
            userSelect: 'none',
          }}
          dataKey={getDataKeyClosePercentage}
          ticks={yAxisTicks}
          orientation="right"
          mirror
          type="number"
          name="수익률"
          tickFormatter={formatPercentage}
          tick={{ fill: tickColor, fontSize: 12 }}
          domain={yAxisDomain}
        />
        {/** XAxis with date display - 각 달의 첫 번째 날짜를 틱으로 사용 */}
        <XAxis
          dataKey="date"
          type="number"
          domain={xAxisDomain}
          axisLine={{ stroke: tickColor }}
          tickLine={{ stroke: tickColor }}
          ticks={monthlyTicks}
          tick={{ fill: tickColor, fontSize: 12 }}
          allowDecimals={false}
          // allowDataOverflow={true}
          // interval="preserveStartEnd"
          tickFormatter={(value, index) => {
            if (!value) return '';
            const date = new Date(value);
            const month = date.getMonth();

            // 첫 번째 틱이 1월(month === 0)인 경우 연도만 표시
            if (index === 0 && month === 0) {
              return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
              });
            }
            // 첫 번째 틱이 1월이 아닌 경우, 첫 번째 틱도 월만 표시
            // 이후 틱은 월만 표시
            return date.toLocaleDateString('ko-KR', {
              month: 'short',
            });
          }}
        />
        {/* 0% 기준선 */}
        <ReferenceLine
          y={0}
          stroke={tickColor}
          strokeWidth={1}
          strokeOpacity={0.5}
          strokeDasharray="4 4"
        />
        {/* 마우스 호버 시 세로선 표시 */}
        <ReferenceLine
          x={data[hoverIndex]?.date ?? 0}
          stroke="#87CEEB"
          strokeWidth={2}
          strokeOpacity={0.8}
        />

        <Line
          type="linear"
          dataKey={getDataKeyReinvestClosePercentage}
          name="Compare value"
          dot={false}
          activeDot={{ fill: compareColor }}
          stroke="url(#compareValueColor)"
          // strokeDasharray="0.1 4"
          strokeLinecap="round"
          strokeWidth={2}
          strokeOpacity={1}
          animationDuration={900}
        />
        {/* Portfolio value 라인 아래 그라디언트 영역 - 항상 표시 */}
        <Area
          type="linear"
          dataKey={getDataKeyClosePercentage}
          fill="url(#portfolioAreaGradient)"
          stroke="none"
          baseValue={areaBaseValue}
          connectNulls={true}
        />
        <Line
          type="linear"
          dataKey={getDataKeyClosePercentage}
          name="Portfolio value"
          activeDot={{ fill: color }}
          dot={false}
          stroke="url(#portfolioColor)"
          strokeWidth={2}
          animationDuration={500}
        />
      </ComposedChart>
    </div>
  );
};

export default CompareChart;
