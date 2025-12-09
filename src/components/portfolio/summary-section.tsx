import Box from '../ui/Box';

export default function SummarySection() {
  return (
    <Box element="section" className="flex flex-col gap-5">
      <div className="flex gap-5 w-full justify-around">
        <div className="flex flex-1">
          <div className="flex flex-col w-full pl-3 border-l border-light-200 dark:border-dark-300 border-l-[5px]">
            <div className="flex w-full">포트폴리오 가치</div>
            <div className="text-4xl font-bold text-black dark:text-white">
              ~ 원
            </div>
            <div className="text-sm text-black/70 dark:text-white/70 mt-1">
              <span
                style={{
                  textDecoration: 'underline',
                  textDecorationStyle: 'dashed',
                  textUnderlineOffset: '4px',
                  textDecorationSkipInk: 'none',
                  cursor: 'pointer',
                }}
              ></span>{' '}
            </div>
            <div className="text-sm text-black/70 dark:text-white/70">
              • n개 보유 종목
            </div>
          </div>
          <div className="flex flex-col w-full pl-3 border-l border-light-200 dark:border-dark-300 border-l-[5px]">
            <div className="flex w-full">총 수익 : ~ %</div>
            <div className="text-4xl font-bold text-black dark:text-white">
              ~ 원
            </div>
          </div>
          <div className="flex flex-col w-full pl-3 border-l border-light-200 dark:border-dark-300 border-l-[5px]">
            <div className="flex w-full">연 환산 IRP : ~ %</div>
            <div className="text-4xl font-bold text-black dark:text-white">
              ~ %
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}
