// app/risk/components/HighVolatilityBar.tsx
'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'TSLA', vol: 25, fill: '#EF4444' },
  { name: 'NVDA', vol: 20, fill: '#3B82F6' },
  { name: 'AAPL', vol: 30, fill: '#22C55E' },
  { name: 'PLTR', vol: 25, fill: '#EAB308' },
];

export default function HighVolatilityBar() {
  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="vol" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
