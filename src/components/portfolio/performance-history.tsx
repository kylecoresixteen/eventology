import Box from '../ui/Box';
import ContentTitle from './content-title';

export default function PerformanceSection() {
  return (
    <Box element="section" className="flex flex-col gap-5">
      <ContentTitle title="Performance History" />

      <div style={{ width: '100%', height: 250 }}>Line Chart</div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button>1M</button>
        <button>3M</button>
        <button>YTD</button>
        <button>Cumulative</button>
      </div>

      <div style={{ height: 40 }}>Deposit Compared Performance</div>
    </Box>
  );
}
