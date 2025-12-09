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
          <th
            style={{
              textAlign: 'left',
              borderBottom: '1px solid #ccc',
              padding: 8,
            }}
          >
            Stocks
          </th>
          <th
            style={{
              textAlign: 'right',
              borderBottom: '1px solid #ccc',
              padding: 8,
            }}
          >
            Maximum Loss
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.name}>
            <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>
              <div className="flex items-center">
                <span
                  className="w-[20px] h-[20px] rounded-md mr-4"
                  style={{ backgroundColor: row.fill }}
                />
                <span>{row.name}</span>
              </div>
            </td>
            <td
              style={{
                padding: 8,
                textAlign: 'right',
                borderBottom: '1px solid #eee',
              }}
            >
              {row.maxLoss}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
