import Box from '../ui/Box';
import ContentTitle from './content-title';

export default function DividendSection() {
  return (
    <Box element="section" className="flex flex-col gap-5">
      <ContentTitle title="Dividend / Cash Flow" />

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 3 }}>
          <div style={{ width: '100%', height: 180 }}>Dividend Calendar</div>
        </div>

        <div style={{ flex: 2 }}>
          <div style={{ height: 40 }}>Dividend Stocks List</div>
          <div style={{ height: 40 }}>Est. Dividend Amount</div>
          <div style={{ height: 40 }}>Dividend Rate</div>
        </div>
      </div>
    </Box>
  );
}
