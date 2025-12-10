// 1년치 차트 데이터 생성 스크립트
// 실행: npx tsx scripts/generate-yearly-data.ts

type DataPoint = {
  date: number;
  close: number;
  maxClose: number;
  reinvestClose?: number;
  netDeposits?: number;
  percentage?: number;
};

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

// 1년치 날짜 데이터 생성 (매일)
const generateYearlyDates = (): number[] => {
  const dates: number[] = [];
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-12-31');

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // 자정 시간으로 설정
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    dates.push(date.getTime());
  }

  return dates;
};

// 초기 baseData 생성
const createBaseData = (dates: number[]): DataPoint[] => {
  return dates.map((date, index) => {
    const baseClose = 200000;
    const baseReinvestClose = 200000;
    const baseNetDeposits = 200000;

    return {
      date,
      close: baseClose,
      maxClose: baseClose,
      reinvestClose: baseReinvestClose,
      netDeposits: baseNetDeposits,
    };
  });
};

// 다이나믹 데이터 생성 (골든/데드 크로스 포함)
const generateDynamicDataWithCrosses = (
  baseData: DataPoint[],
): DataPointWithPercentage[] => {
  const result: DataPointWithPercentage[] = [];
  const dataLength = baseData.length;

  if (dataLength === 0) return result;

  // 초기값 설정
  let currentClose = baseData[0]?.close ?? 200000;
  let currentReinvestClose = baseData[0]?.reinvestClose ?? currentClose;
  const initialClose = currentClose;
  const initialReinvestClose = currentReinvestClose;

  // 트렌드 구간 정의 (상승/하락/횡보) - 변동성 높게 설정
  const trendSegments = [
    { start: 0, end: dataLength * 0.2, trend: 'up', volatility: 0.06 }, // 초반 상승
    {
      start: dataLength * 0.2,
      end: dataLength * 0.35,
      trend: 'down',
      volatility: 0.08,
    }, // 조정
    {
      start: dataLength * 0.35,
      end: dataLength * 0.5,
      trend: 'up',
      volatility: 0.05,
    }, // 반등
    {
      start: dataLength * 0.5,
      end: dataLength * 0.65,
      trend: 'sideways',
      volatility: 0.04,
    }, // 횡보
    {
      start: dataLength * 0.65,
      end: dataLength * 0.8,
      trend: 'up',
      volatility: 0.07,
    }, // 상승
    {
      start: dataLength * 0.8,
      end: dataLength,
      trend: 'down',
      volatility: 0.08,
    }, // 하락
  ];

  // 골든/데드 크로스 지점
  const crossPoints = [
    { position: dataLength * 0.25, type: 'golden' },
    { position: dataLength * 0.4, type: 'dead' },
    { position: dataLength * 0.55, type: 'golden' },
    { position: dataLength * 0.75, type: 'dead' },
  ];

  // 시드 고정 (재현 가능한 데이터)
  let seed = 12345;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < dataLength; i++) {
    const point = baseData[i];
    if (!point) continue;

    // 현재 구간의 트렌드 찾기
    const currentSegment =
      trendSegments.find((seg) => i >= seg.start && i < seg.end) ||
      trendSegments[0];

    // 랜덤 워크: 가우시안 노이즈 기반 변동
    const randomWalk = (random() - 0.5) * 2;
    const volatility = currentSegment.volatility;

    // 트렌드에 따른 방향성 (변동성 높게)
    let trendMultiplier = 0;
    if (currentSegment.trend === 'up') {
      trendMultiplier = 0.002 + random() * 0.002; // 상승 트렌드
    } else if (currentSegment.trend === 'down') {
      trendMultiplier = -0.002 - random() * 0.002; // 하락 트렌드
    } else {
      trendMultiplier = (random() - 0.5) * 0.001; // 횡보
    }

    // 가격 변화 계산 (랜덤 워크 + 트렌드)
    let priceChange =
      currentClose * (trendMultiplier + randomWalk * volatility);

    // 골든/데드 크로스 근처에서 조정
    const nearbyCross = crossPoints.find(
      (cp) => Math.abs(i - cp.position) < dataLength * 0.05,
    );

    if (nearbyCross) {
      const distance = Math.abs(i - nearbyCross.position) / (dataLength * 0.05);
      const crossInfluence = (1 - distance) * 0.02; // 교차 지점 근처에서 영향력 증가

      if (nearbyCross.type === 'golden') {
        // 골든 크로스: close가 reinvestClose를 위로 돌파하도록
        priceChange += currentClose * crossInfluence;
      } else {
        // 데드 크로스: close가 reinvestClose를 아래로 돌파하도록
        priceChange -= currentClose * crossInfluence;
      }
    }

    // 새로운 가격 계산
    currentClose = Math.max(initialClose * 0.5, currentClose + priceChange);

    // reinvestClose는 close보다 약간 다른 움직임 (배당 재투자 효과)
    const reinvestVolatility = volatility * 0.7; // 더 낮은 변동성
    const reinvestTrend = trendMultiplier * 0.8; // 더 완만한 트렌드
    const reinvestChange =
      currentReinvestClose * (reinvestTrend + randomWalk * reinvestVolatility);
    currentReinvestClose = Math.max(
      initialReinvestClose * 0.5,
      currentReinvestClose + reinvestChange,
    );

    // maxClose 업데이트
    const maxClose = Math.max(
      point.maxClose ?? currentClose,
      currentClose,
      currentReinvestClose,
    );

    // 수익률 계산
    const closePercentage =
      initialClose > 0
        ? ((currentClose - initialClose) / initialClose) * 100
        : 0;
    const reinvestClosePercentage =
      initialReinvestClose > 0
        ? ((currentReinvestClose - initialReinvestClose) /
            initialReinvestClose) *
          100
        : 0;
    const netDepositsPercentage = 0;

    result.push({
      ...point,
      date: point.date,
      close: currentClose,
      reinvestClose: currentReinvestClose,
      maxClose,
      closePercentage,
      reinvestClosePercentage,
      netDepositsPercentage,
    });
  }

  return result;
};

// 메인 실행
const main = () => {
  console.log('1년치 데이터 생성 시작...');

  const dates = generateYearlyDates();
  console.log(`날짜 개수: ${dates.length}개`);

  const baseData = createBaseData(dates);
  console.log('Base 데이터 생성 완료');

  const data = generateDynamicDataWithCrosses(baseData);
  console.log('다이나믹 데이터 생성 완료');

  // JSON 파일로 저장
  const fs = require('fs');
  const path = require('path');

  const outputPath = path.join(
    __dirname,
    '../src/data/portfolio-yearly-data.json',
  );
  const outputDir = path.dirname(outputPath);

  // 디렉토리가 없으면 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`데이터 저장 완료: ${outputPath}`);
  console.log(`총 ${data.length}개의 데이터 포인트 생성됨`);
};

main();
