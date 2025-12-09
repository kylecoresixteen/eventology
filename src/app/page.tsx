import ChatWindow from '@/components/chat-window';
import Events from '@/components/events';
import InsightArticles, { Article } from '@/components/insight-articles';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이벤톨로지',
  description: 'AI를 통해 투자 전략을 세워보세요',
};

const Home = () => {
  return (
    <>
      <ChatWindow />
      <span className="text-2xl text-black/70 dark:text-white/70">이벤트</span>
      <div className="mb-4 w-full" />
      <Events
        items={[
          {
            id: '1',
            title: '넷플릭스, 워너브라더스 인수 계약 최종 테스트 중, ',
            content:
              '넷플릭스 미국 정부의 승인이 필요한 마지막 장벽을 넘어, 넷플릭스가 워너브라더스 디스커버리를 인수할 수 있는지 여부가 결정됩니다. 이 거래는 전 세계 스트리밍 시장의 미래 구조를 결정할 수 있습니다.',

            region: 'us',
          },
          {
            id: '2',
            title: '구글 AI 기술 출시',
            content:
              '구글이 새로운 AI 기술을 출시합니다. 이 기술은 사용자의 요청을 더 빠르고 정확하게 처리할 수 있습니다.',
            region: 'us',
          },
          {
            id: '3',
            title: '삼성전자 신제품 출시',
            content:
              '삼성전자가 새로운 신제품을 출시합니다. 이 제품은 트라이폴드 디스플레이를 사용합니다.',
            region: 'kr',
          },
        ]}
      />
      <div className="mb-10" />
      <span className="text-2xl text-black/70 dark:text-white/70">
        인사이트
      </span>
      <div className="mb-4 w-full" />
      <InsightArticles
        items={[
          {
            id: '1',
            title: 'AI 기술의 혁신',
            content:
              'AI는 기술의 혁신입니다. 이 기술은 사용자의 요청을 더 빠르고 정확하게 처리할 수 있습니다.',
          },
          {
            id: '2',
            title: 'AI 기술의 혁신',
            content:
              'AI는 기술의 혁신입니다. 이 기술은 사용자의 요청을 더 빠르고 정확하게 처리할 수 있습니다.',
          },
          {
            id: '3',
            title: 'AI 기술의 혁신',
            content:
              'AI는 기술의 혁신입니다. 이 기술은 사용자의 요청을 더 빠르고 정확하게 처리할 수 있습니다.',
          },
          {
            id: '4',
            title: 'AI 기술의 혁신',
            content:
              'AI는 기술의 혁신입니다. 이 기술은 사용자의 요청을 더 빠르고 정확하게 처리할 수 있습니다.',
          },
        ]}
      />
    </>
  );
};

export default Home;
