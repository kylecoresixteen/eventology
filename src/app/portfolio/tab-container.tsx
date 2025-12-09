import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import React from 'react';

export default function TabContainer({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: { name: string }[];
}) {
  return (
    <div className="flex h-screen w-full justify-center px-4 pt-4">
      <div className="w-full">
        <TabGroup>
          <TabList className="flex gap-4">
            {categories.map(({ name }) => (
              <Tab
                key={name}
                className="focus:outline-none rounded-full px-3 py-1 text-sm/6 font-semibold text-white focus:outline-none hover:bg-white/5 data-[selected]:bg-white/10 data-[selected]:hover:bg-white/10 transition-colors"
              >
                {name}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-3">{children}</TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
