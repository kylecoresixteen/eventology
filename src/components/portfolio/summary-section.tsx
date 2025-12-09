import Box from '../ui/Box';

export default function SummarySection() {
  return (
    <Box element="section" className="flex flex-col gap-5">
      <h2>요약 정보</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div>
          <div style={{ width: '100%', height: 120 }}>총 자산(차트)</div>
        </div>

        <div>
          <div style={{ width: '100%', height: 120 }}>수익률(게이지)</div>
        </div>

        <div>
          <div style={{ width: '100%', height: 120 }}>리스크 등급</div>
        </div>

        <div>
          <div style={{ width: '100%', height: 120 }}>배당 예정</div>
        </div>
      </div>
    </Box>
  );
}
