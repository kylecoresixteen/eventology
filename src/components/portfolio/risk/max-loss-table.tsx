// app/risk/components/MaxLossTable.tsx
'use client';

const data = [
  { name: 'TSLA', maxLoss: '-18.3%', fill: '#EF4444' },
  { name: 'NVDA', maxLoss: '-12.5%', fill: '#3B82F6' },
  { name: 'AAPL', maxLoss: '-9.8%', fill: '#22C55E' },
  { name: 'AMZN', maxLoss: '-7.2%', fill: '#f63b95' },
];

export default function MaxLossTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th className="text-left p-2 border-b border-light-200/80 dark:border-dark-200/80">
            종목
          </th>
          <th className="text-right p-2 border-b border-light-200/80 dark:border-dark-200/80">
            최대 손실
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.name}>
            <td className="p-2 border-b border-light-200/80 dark:border-dark-200/80">
              <div className="flex items-center">
                <span
                  className="w-[20px] h-[20px] rounded-md mr-4"
                  style={{ backgroundColor: row.fill }}
                />
                <span>{row.name}</span>
              </div>
            </td>
            <td className="p-2 text-right border-b border-light-200/80 dark:border-dark-200/80">
              {row.maxLoss}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
