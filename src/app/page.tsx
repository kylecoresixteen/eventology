import ChatWindow from '@/components/chat-window';
import Events from '@/components/events';
import InsightArticles, { Article } from '@/components/insight-articles';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eventology',
  description: 'Your AI Agent for your investment.',
};

const Home = () => {
  return (
    <>
      <ChatWindow />
      <span className="text-2xl text-black/70 dark:text-white/70">Events</span>
      <div className="mb-4 w-full" />
      <Events
        items={[
          {
            id: '1',
            title:
              'Netflix’s Bid for Warner Bros. Faces a Defining Test as Trump Review Looms',
            content:
              'Netflix may appear to be closing in on its takeover of Warner Bros. Discovery, but the biggest test is still ahead. The deal now hinges on approval from the Trump administration, a final hurdle that could determine not only the fate of the acquisition but also the future shape of the global streaming market.',

            region: 'fr',
          },
          {
            id: '2',
            title: 'The Future of AI',
            content: 'AI is the future of the world.',
            region: 'us',
          },
          {
            id: '3',
            title: 'The Future of AI',
            content: 'AI is the future of the world.',
            region: 'kr',
          },
        ]}
      />
      <div className="mb-10" />
      <span className="text-2xl text-black/70 dark:text-white/70">
        Insights
      </span>
      <div className="mb-4 w-full" />
      <InsightArticles
        items={[
          {
            id: '1',
            title: 'The Future of AI',
            content: 'AI is the future of the world.',
          },
          {
            id: '2',
            title: 'The Future of AI',
            content: 'AI is the future of the world.',
          },
          {
            id: '3',
            title: 'The Future of AI',
            content: 'AI is the future of the world.',
          },
          {
            id: '4',
            title: 'The Future of AI',
            content: 'AI is the future of the world.',
          },
        ]}
      />
    </>
  );
};

export default Home;
