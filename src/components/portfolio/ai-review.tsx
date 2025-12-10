import { ThumbsUp, TriangleAlertIcon, WandSparklesIcon } from 'lucide-react';
import ContentTitle from './content-title';

export default function AiReview() {
  return (
    <div className="flex flex-col gap-2 w-full mt-10">
      <ContentTitle
        title={
          <div className="flex flex-row items-center gap-2">
            <p>AI가 포트폴리오를 분석해봤어요</p>
            <WandSparklesIcon size={30} />
          </div>
        }
        className="text-2xl"
      />
      <div className="flex w-full flex-col gap-10 text-sm">
        <div className="flex flex-row items-center gap-6">
          <ThumbsUp size={50} color="yellow" />

          <div className="flex flex-col flex-start">
            <ContentTitle title="이런 점은 좋아요." className="text-lg mb-2" />
            <div>
              <p> - 종목이 4개예요. 관리가 쉬운 포트폴리오예요.</p>
              <p>
                {' '}
                - 대형주 위주로 매수 했기 때문에 안정적인 수익률을 기대할 수
                있어요.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-6">
          <TriangleAlertIcon size={50} color="yellow" />

          <div className="flex flex-col flex-start">
            <ContentTitle
              title="이런 점은 개선이 필요해요."
              className="text-lg mb-2"
            />
            <div>
              <p>
                {' '}
                - 종목이 8개예요. 관리가 어려운 포트폴리오예요. 보통 5개 이하로
                관리하는 것이 좋아요.
              </p>
              <p>
                {' '}
                - 현금 비중 5프로 미만으로 내려갔어요. 현금 비중은 보통 10프로
                이상이 좋아요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
