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
// #region sample data and types
import yearlyData from '@/data/portfolio-yearly-data.json';

const formatUsdCompressed = (n: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumSignificantDigits: 3,
  })
    .format(n)
    .toUpperCase();
};

const formatPercentage = (n: number) => {
  const sign = n >= 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}%`;
};

const getDataKeyClose = (point: any) => point.close;
const getDataKeyReinvestClose = (point: any) => point.reinvestClose;
const getDataKeyClosePercentage = (point: any) => point.closePercentage;
const getDataKeyReinvestClosePercentage = (point: any) =>
  point.reinvestClosePercentage;

const rawData = [
  {
    date: 1754265600000,
    close: 200250.28586,
    maxClose: 200329.40245,
    reinvestClose: 200250.28586,
    netDeposits: 200000,
    percentage: -1.23,
  },
  {
    date: 1754352000000,
    close: 199272.96485,
    maxClose: 199474.10888,
    reinvestClose: 199272.96485,
    netDeposits: 200000,
    percentage: -0.51,
  },
  {
    date: 1754438400000,
    close: 200912.62441,
    maxClose: 200912.62441,
    reinvestClose: 200912.62441,
    netDeposits: 200000,
    percentage: 0.03,
  },
  {
    date: 1754524800000,
    close: 200841.07452,
    maxClose: 200841.07452,
    reinvestClose: 200841.07452,
    netDeposits: 200000,
    percentage: 0.02,
  },
  {
    date: 1754611200000,
    close: 202280.1764,
    maxClose: 202819.09273,
    reinvestClose: 202819.09273,
    netDeposits: 200000,
    percentage: -0.28,
  },
  {
    date: 1754697600000,
    close: 202280.1764,
    maxClose: 202819.12355,
    reinvestClose: 202819.12355,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1754784000000,
    close: 202280.1764,
    maxClose: 202819.12355,
    reinvestClose: 202819.12355,
    netDeposits: 200000,
  },
  {
    date: 1754870400000,
    close: 201695.79315,
    maxClose: 202233.53819000002,
    reinvestClose: 202233.53819000002,
    netDeposits: 200000,
  },
  {
    date: 1754956800000,
    close: 204165.11346,
    maxClose: 204708.99235,
    reinvestClose: 204708.99235,
    netDeposits: 200000,
  },
  {
    date: 1755043200000,
    close: 204683.86015,
    maxClose: 205229.85045,
    reinvestClose: 205229.85045,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1755129600000,
    close: 204386.16203,
    maxClose: 204931.76703000002,
    reinvestClose: 204931.76703000002,
    netDeposits: 200000,
  },
  {
    date: 1755216000000,
    close: 203872.79671,
    maxClose: 204417.21500999999,
    reinvestClose: 204417.21500999999,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1755302400000,
    close: 203875.56671,
    maxClose: 204419.98501,
    reinvestClose: 204419.98501,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1755388800000,
    close: 203875.56671,
    maxClose: 204419.98501,
    reinvestClose: 204419.98501,
    netDeposits: 200000,
  },
  {
    date: 1755475200000,
    close: 203990.21558,
    maxClose: 204534.66470999998,
    reinvestClose: 204534.66470999998,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1755561600000,
    close: 202693.85337,
    maxClose: 203235.18933,
    reinvestClose: 203235.18933,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1755648000000,
    close: 202185.45487,
    maxClose: 202725.1726,
    reinvestClose: 202725.1726,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1755734400000,
    close: 201559.8993,
    maxClose: 202097.73681,
    reinvestClose: 202097.73681,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1755820800000,
    close: 204676.42605,
    maxClose: 205222.81705,
    reinvestClose: 205222.81705,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1755907200000,
    close: 204680.26605,
    maxClose: 205226.65705,
    reinvestClose: 205226.65705,
    netDeposits: 200000,
    percentage: 0.13,
  },

  {
    date: 1756080000000,
    close: 203829.67195,
    maxClose: 204373.79742999998,
    reinvestClose: 204373.79742999998,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1756166400000,
    close: 204599.65998,
    maxClose: 205145.98933,
    reinvestClose: 205145.98933,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1756252800000,
    close: 205156.94904,
    maxClose: 205704.15302,
    reinvestClose: 205704.15302,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1756339200000,
    close: 205982.92992,
    maxClose: 206531.6413,
    reinvestClose: 206531.6413,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1756425600000,
    close: 204750.72779,
    maxClose: 205296.33207,
    reinvestClose: 205296.33207,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1756512000000,
    close: 204771.30779,
    maxClose: 205316.91207,
    reinvestClose: 205316.91207,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1756598400000,
    close: 204771.30779,
    maxClose: 205316.91207,
    reinvestClose: 205316.91207,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1756684800000,
    close: 204771.30779,
    maxClose: 205316.91207,
    reinvestClose: 205316.91207,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1756771200000,
    close: 203336.77508,
    maxClose: 203878.38012,
    reinvestClose: 203878.38012,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1756857600000,
    close: 204313.32762,
    maxClose: 204857.62446,
    reinvestClose: 204857.62446,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1756944000000,
    close: 206164.82454,
    maxClose: 206713.68974,
    reinvestClose: 206713.68974,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1757030400000,
    close: 205688.30079,
    maxClose: 206235.95084,
    reinvestClose: 206235.95084,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1757116800000,
    close: 205694.24079,
    maxClose: 206241.89084,
    reinvestClose: 206241.89084,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1757203200000,
    close: 205694.24079,
    maxClose: 206241.89084,
    reinvestClose: 206241.89084,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1757289600000,
    close: 206248.11961,
    maxClose: 206797.50779,
    reinvestClose: 206797.50779,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1757376000000,
    close: 206361.60467,
    maxClose: 206911.90037,
    reinvestClose: 206911.90037,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1757462400000,
    close: 206931.57487,
    maxClose: 207483.45488,
    reinvestClose: 207483.45488,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1757548800000,
    close: 208777.49902,
    maxClose: 209334.08583,
    reinvestClose: 209334.08583,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1757635200000,
    close: 208367.30969,
    maxClose: 209021.15418,
    reinvestClose: 208923.34276,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1757721600000,
    close: 208370.03969,
    maxClose: 209021.15418,
    reinvestClose: 208926.07276,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1757808000000,
    close: 208370.03969,
    maxClose: 209021.15418,
    reinvestClose: 208926.07276,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1757894400000,
    close: 209371.73869,
    maxClose: 210020.92301,
    reinvestClose: 209930.4328,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1757980800000,
    close: 208934.04827,
    maxClose: 209490.66585,
    reinvestClose: 209490.66585,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1758067200000,
    close: 208731.12737,
    maxClose: 209287.02201000002,
    reinvestClose: 209287.02201000002,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1758153600000,
    close: 210068.19722,
    maxClose: 210627.04514,
    reinvestClose: 210627.04514,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1758240000000,
    close: 210862.44012,
    maxClose: 211513.10408,
    reinvestClose: 211423.62606,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1758326400000,
    close: 210859.46012,
    maxClose: 211513.10408,
    reinvestClose: 211420.64606,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1758412800000,
    close: 210859.46012,
    maxClose: 211513.10408,
    reinvestClose: 211420.64606,
    netDeposits: 200000,
    percentage: 0.13,
  },
  {
    date: 1758499200000,
    close: 291534.89436,
    maxClose: 292736.93416,
    reinvestClose: 292736.93416,
    netDeposits: 280000,
    percentage: 0.13,
  },
  {
    date: 1758585600000,
    close: 289886.60569,
    maxClose: 291084.14519,
    reinvestClose: 291084.14519,
    netDeposits: 280000,
    percentage: 0.13,
  },
  {
    date: 1758672000000,
    close: 288803.00042,
    maxClose: 289996.03962,
    reinvestClose: 289996.03962,
    netDeposits: 280000,
    percentage: 0.13,
  },
  {
    date: 1758758400000,
    close: 287237.53875,
    maxClose: 288424.69800000003,
    reinvestClose: 288424.69800000003,
    netDeposits: 280000,
    percentage: 0.13,
  },
  {
    date: 1758844800000,
    close: 289098.40234,
    maxClose: 290292.75549999997,
    reinvestClose: 290292.75549999997,
    netDeposits: 280000,
  },
  {
    date: 1758931200000,
    close: 289100.27234,
    maxClose: 290294.6255,
    reinvestClose: 290294.6255,
    netDeposits: 280000,
  },
  {
    date: 1759017600000,
    close: 289100.27234,
    maxClose: 290294.6255,
    reinvestClose: 290294.6255,
    netDeposits: 280000,
  },
  {
    date: 1759104000000,
    close: 289917.68812,
    maxClose: 291114.99768000003,
    reinvestClose: 291114.99768000003,
    netDeposits: 280000,
  },
  {
    date: 1759190400000,
    close: 290927.67041,
    maxClose: 292128.23201000004,
    reinvestClose: 292128.23201000004,
    netDeposits: 280000,
  },
  {
    date: 1759276800000,
    close: 291725.80907,
    maxClose: 292930.93666,
    reinvestClose: 292930.93666,
    netDeposits: 280000,
  },
  {
    date: 1759363200000,
    close: 291954.38666,
    maxClose: 293161.35379,
    reinvestClose: 293161.35379,
    netDeposits: 280000,
  },
  {
    date: 1759449600000,
    close: 291896.55473,
    maxClose: 293103.65326,
    reinvestClose: 293103.65326,
    netDeposits: 280000,
  },
  {
    date: 1759536000000,
    close: 291896.97473,
    maxClose: 293104.07326000003,
    reinvestClose: 293104.07326000003,
    netDeposits: 280000,
  },
  {
    date: 1759622400000,
    close: 291896.97473,
    maxClose: 293104.07326000003,
    reinvestClose: 293104.07326000003,
    netDeposits: 280000,
  },
  {
    date: 1759708800000,
    close: 293116.53883,
    maxClose: 294328.13765999995,
    reinvestClose: 294328.13765999995,
    netDeposits: 280000,
  },
  {
    date: 1759795200000,
    close: 292039.96981,
    maxClose: 293246.27995999996,
    reinvestClose: 293246.27995999996,
    netDeposits: 280000,
  },
  {
    date: 1759881600000,
    close: 293856.81708,
    maxClose: 295070.45254,
    reinvestClose: 295070.45254,
    netDeposits: 280000,
  },
  {
    date: 1759968000000,
    close: 293065.79468,
    maxClose: 294275.58681999997,
    reinvestClose: 294275.58681999997,
    netDeposits: 280000,
  },
  {
    date: 1760054400000,
    close: 284898.1604,
    maxClose: 286075.43213,
    reinvestClose: 286075.43213,
    netDeposits: 280000,
  },
  {
    date: 1760140800000,
    close: 284915.9704,
    maxClose: 286093.24212999997,
    reinvestClose: 286093.24212999997,
    netDeposits: 280000,
  },
  {
    date: 1760227200000,
    close: 284915.9704,
    maxClose: 286093.24212999997,
    reinvestClose: 286093.24212999997,
    netDeposits: 280000,
  },
  {
    date: 1760313600000,
    close: 289631.91477,
    maxClose: 290827.74613,
    reinvestClose: 290827.74613,
    netDeposits: 280000,
  },
  {
    date: 1760400000000,
    close: 289375.17,
    maxClose: 290569.7531,
    reinvestClose: 290569.7531,
    netDeposits: 280000,
  },
  {
    date: 1760486400000,
    close: 290518.57728,
    maxClose: 291718.21911,
    reinvestClose: 291718.21911,
    netDeposits: 280000,
  },
  {
    date: 1760572800000,
    close: 288250.37569,
    maxClose: 289441.6739,
    reinvestClose: 289441.6739,
    netDeposits: 280000,
  },
  {
    date: 1760659200000,
    close: 289546.09897,
    maxClose: 290945.19578,
    reinvestClose: 290945.19578,
    netDeposits: 280000,
  },
  {
    date: 1760745600000,
    close: 289565.87897,
    maxClose: 290968.16831000004,
    reinvestClose: 290968.16831000004,
    netDeposits: 280000,
  },
  {
    date: 1760832000000,
    close: 289565.87897,
    maxClose: 290968.16831000004,
    reinvestClose: 290968.16831000004,
    netDeposits: 280000,
  },
  {
    date: 1760918400000,
    close: 292661.84624,
    maxClose: 294226.94687,
    reinvestClose: 294226.94687,
    netDeposits: 280000,
  },
  {
    date: 1761004800000,
    close: 292596.13311,
    maxClose: 294278.6664,
    reinvestClose: 294278.6664,
    netDeposits: 280000,
  },
  {
    date: 1761091200000,
    close: 291286.23879,
    maxClose: 293053.57587999996,
    reinvestClose: 293053.57587999996,
    netDeposits: 280000,
  },
  {
    date: 1761177600000,
    close: 292980.34027,
    maxClose: 294761.25367999997,
    reinvestClose: 294761.25367999997,
    netDeposits: 280000,
  },
  {
    date: 1761264000000,
    close: 295334.07645,
    maxClose: 297264.83434,
    reinvestClose: 297264.83434,
    netDeposits: 280000,
  },
  {
    date: 1761350400000,
    close: 295339.16645,
    maxClose: 297287.49003000004,
    reinvestClose: 297287.49003000004,
    netDeposits: 280000,
  },
  {
    date: 1761436800000,
    close: 295339.16645,
    maxClose: 297287.49003000004,
    reinvestClose: 297287.49003000004,
    netDeposits: 280000,
  },
  {
    date: 1761523200000,
    close: 298898.51849,
    maxClose: 301027.20428,
    reinvestClose: 301027.20428,
    netDeposits: 280000,
  },
  {
    date: 1761609600000,
    close: 299458.39529,
    maxClose: 301698.80308000004,
    reinvestClose: 301698.80308000004,
    netDeposits: 280000,
  },
  {
    date: 1761696000000,
    close: 300155.03367,
    maxClose: 302519.21663,
    reinvestClose: 302519.21663,
    netDeposits: 280000,
  },
  {
    date: 1761782400000,
    close: 296838.93323,
    maxClose: 299172.16269,
    reinvestClose: 299172.16269,
    netDeposits: 280000,
  },
  {
    date: 1761868800000,
    close: 297645.82883,
    maxClose: 299987.45458,
    reinvestClose: 299987.45458,
    netDeposits: 280000,
  },
  {
    date: 1761955200000,
    close: 297436.88883,
    maxClose: 299778.51458,
    reinvestClose: 299778.51458,
    netDeposits: 280000,
  },
  {
    date: 1762041600000,
    close: 297436.88883,
    maxClose: 299778.51458,
    reinvestClose: 299778.51458,
    netDeposits: 280000,
  },
  {
    date: 1762128000000,
    close: 297896.80552,
    maxClose: 300467.03155,
    reinvestClose: 300467.03155,
    netDeposits: 280000,
  },
  {
    date: 1762214400000,
    close: 294259.78159,
    maxClose: 296810.06841,
    reinvestClose: 296810.06841,
    netDeposits: 280000,
  },
  {
    date: 1762300800000,
    close: 295344.54123,
    maxClose: 298175.78807999997,
    reinvestClose: 298175.78807999997,
    netDeposits: 280000,
  },
  {
    date: 1762387200000,
    close: 292176.91517,
    maxClose: 294964.41625999997,
    reinvestClose: 294964.41625999997,
    netDeposits: 280000,
  },
  {
    date: 1762473600000,
    close: 293150.13876,
    maxClose: 295951.40437,
    reinvestClose: 295951.40437,
    netDeposits: 280000,
  },
  {
    date: 1762560000000,
    close: 293164.76876,
    maxClose: 296001.37622000003,
    reinvestClose: 296001.37622000003,
    netDeposits: 280000,
  },
  {
    date: 1762646400000,
    close: 293164.76876,
    maxClose: 296001.37622000003,
    reinvestClose: 296001.37622000003,
    netDeposits: 280000,
  },
  {
    date: 1762992000000,
    close: 367372.436370742,
    maxClose: 367372.436370742,
    netDeposits: 355000,
  },
];

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

const baseData: DataPointWithPercentage[] = rawData.map((point) => {
  const firstClose = rawData[0]?.close ?? 0;
  const firstReinvestClose =
    rawData.find((d) => d.reinvestClose)?.reinvestClose ?? 0;
  const firstNetDeposits = rawData[0]?.netDeposits ?? 0;

  const closePercentage =
    firstClose > 0 ? ((point.close - firstClose) / firstClose) * 100 : 0;
  const reinvestClosePercentage =
    firstReinvestClose > 0 && point.reinvestClose
      ? ((point.reinvestClose - firstReinvestClose) / firstReinvestClose) * 100
      : 0;
  const netDepositsPercentage =
    firstNetDeposits > 0 && point.netDeposits
      ? ((point.netDeposits - firstNetDeposits) / firstNetDeposits) * 100
      : 0;

  return {
    ...point,
    closePercentage,
    reinvestClosePercentage,
    netDepositsPercentage,
  };
});

// 진짜 주식처럼 올라갔다 내려갔다 하는 다이나믹한 데이터 생성
// 랜덤 워크 패턴 + 변동성 + 트렌드 + 골든/데드 크로스
const generateDynamicDataWithCrosses = (
  baseData: DataPointWithPercentage[],
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

  for (let i = 0; i < dataLength; i++) {
    const point = baseData[i];
    if (!point) continue;

    // 현재 구간의 트렌드 찾기
    const currentSegment =
      trendSegments.find((seg) => i >= seg.start && i < seg.end) ||
      trendSegments[0];

    // 랜덤 워크: 가우시안 노이즈 기반 변동
    const randomWalk = (Math.random() - 0.5) * 2;
    const volatility = currentSegment.volatility;

    // 트렌드에 따른 방향성 (변동성 높게)
    let trendMultiplier = 0;
    if (currentSegment.trend === 'up') {
      trendMultiplier = 0.002 + Math.random() * 0.002; // 상승 트렌드
    } else if (currentSegment.trend === 'down') {
      trendMultiplier = -0.002 - Math.random() * 0.002; // 하락 트렌드
    } else {
      trendMultiplier = (Math.random() - 0.5) * 0.001; // 횡보
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
    const netDepositsPercentage = point.netDepositsPercentage ?? 0;

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

  // 1달 간격으로 틱 계산
  const monthlyTicks = useMemo(() => {
    if (data.length === 0) return [];

    const firstDate = new Date(data[0]?.date ?? 0);
    const lastDate = new Date(data[data.length - 1]?.date ?? 0);
    const firstTimestamp = firstDate.getTime();
    const lastTimestamp = lastDate.getTime();
    const ticks: number[] = [];

    // 첫 날짜가 속한 달의 1일부터 시작
    let currentDate = new Date(
      firstDate.getFullYear(),
      firstDate.getMonth(),
      1,
    );

    // 마지막 날짜까지 1달 간격으로 틱 생성
    while (currentDate <= lastDate) {
      const tickTime = currentDate.getTime();
      // 도메인 경계에 너무 가까운 틱은 제외 (중복 방지)
      const margin = (lastTimestamp - firstTimestamp) * 0.02; // 2% 마진
      if (
        tickTime >= firstTimestamp + margin &&
        tickTime <= lastTimestamp - margin
      ) {
        ticks.push(tickTime);
      }
      // 다음 달 1일로 이동
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1,
      );
    }

    return ticks;
  }, []);

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
        margin={{ left: 6, right: 6 }}
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
          tick={{ fill: tickColor, fontSize: 14 }}
          domain={yAxisDomain}
        />
        {/** XAxis with date display - 1달 간격으로 표시 */}
        <XAxis
          dataKey="date"
          type="number"
          domain={[data[0]?.date ?? 0, data[data.length - 1]?.date ?? 0]}
          axisLine={{ stroke: tickColor }}
          tickLine={{ stroke: tickColor }}
          ticks={monthlyTicks}
          tick={{ fill: tickColor, fontSize: 14 }}
          tickMargin={8}
          allowDecimals={false}
          tickFormatter={(value) => {
            if (!value) return '';
            const date = new Date(value);
            return date.toLocaleDateString('ko-KR', {
              year: 'numeric',
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
          // label={({ viewBox, x, y }) => {
          //   if (viewBox === undefined || x === undefined || y === undefined) {
          //     return null;
          //   }
          //   return (
          //     <g>
          //       <text
          //         x={x}
          //         y={viewBox.y - 5}
          //         fill={tickColor}
          //         fontSize={14}
          //         fontWeight={500}
          //         textAnchor="middle"
          //         className="pointer-events-none"
          //       >
          //         {new Date(data[hoverIndex].date).toLocaleDateString('ko-KR', {
          //           month: 'short',
          //           day: 'numeric',
          //         })}
          //       </text>
          //     </g>
          //   );
          // }}
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
