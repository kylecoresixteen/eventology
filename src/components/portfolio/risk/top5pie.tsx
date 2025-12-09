// app/risk/components/Top5Pie.tsx
'use client';

import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';

export default function Top5Pie({
  data,
}: {
  data: { name: string; value: number; fill: string }[];
}) {
  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            stroke="none"
            label
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
