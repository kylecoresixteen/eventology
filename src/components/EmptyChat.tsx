'use client';

import { useEffect, useState } from 'react';
import { BrainCircuitIcon, BrainIcon, Settings } from 'lucide-react';
import EmptyChatMessageInput from './EmptyChatMessageInput';
import { File } from './chat-window';
import Link from 'next/link';
import WeatherWidget from './WeatherWidget';
import NewsArticleWidget from './NewsArticleWidget';
import SettingsButtonMobile from '@/components/Settings/SettingsButtonMobile';
import {
  getShowNewsWidget,
  getShowWeatherWidget,
} from '@/lib/config/clientRegistry';

const EmptyChat = () => {
  const [showWeather, setShowWeather] = useState(() =>
    typeof window !== 'undefined' ? getShowWeatherWidget() : true,
  );
  const [showNews, setShowNews] = useState(() =>
    typeof window !== 'undefined' ? getShowNewsWidget() : true,
  );

  useEffect(() => {
    const updateWidgetVisibility = () => {
      setShowWeather(getShowWeatherWidget());
      setShowNews(getShowNewsWidget());
    };

    updateWidgetVisibility();

    window.addEventListener('client-config-changed', updateWidgetVisibility);
    window.addEventListener('storage', updateWidgetVisibility);

    return () => {
      window.removeEventListener(
        'client-config-changed',
        updateWidgetVisibility,
      );
      window.removeEventListener('storage', updateWidgetVisibility);
    };
  }, []);

  return (
    <div className="relative">
      <div className="absolute w-full flex flex-row items-center justify-end mr-5 mt-5">
        <SettingsButtonMobile />
      </div>
      <div className="flex flex-col items-center justify-center min-h-[500px] max-w-screen-sm mx-auto p-2 space-y-4">
        <div className="flex flex-col items-center justify-center w-full space-y-8">
          <div className="flex flex-row items-center justify-center gap-2">
            <BrainCircuitIcon size={60} className="mb-2.5" />
            <h1 className="text-5xl text-black dark:text-white font-medium">
              Eventology.
            </h1>
          </div>
          <h2 className="text-black/70 dark:text-white/70 text-lg font-thin -mt-4">
            AI를 통해 투자 전략을 세워보세요
          </h2>
          <EmptyChatMessageInput />
        </div>
        {(showWeather || showNews) && (
          <div className="flex flex-col w-full gap-4 mt-2 sm:flex-row sm:justify-center">
            {showWeather && (
              <div className="flex-1 w-full">
                <WeatherWidget />
              </div>
            )}
            {showNews && (
              <div className="flex-1 w-full">
                <NewsArticleWidget />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyChat;
