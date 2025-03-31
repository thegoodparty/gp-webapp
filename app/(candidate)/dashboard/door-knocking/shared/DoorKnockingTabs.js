'use client';

import Tabs from '@shared/utils/Tabs';
import { useRouter } from 'next/navigation';

const tabLabels = ['Interactions', 'Door Knocking Scripts'];
const tabPanels = [<div key="1"></div>, <div key="2"></div>];
const tabLinks = [
  '/dashboard/door-knocking',
  '/dashboard/door-knocking/surveys',
];

export default function DoorKnockingTabs({ activeTab }) {
  const router = useRouter();
  const handleTabChange = (tab) => {
    router.push(tabLinks[tab]);
  };
  return (
    <Tabs
      tabLabels={tabLabels}
      tabPanels={tabPanels}
      changeCallback={handleTabChange}
      activeTab={activeTab}
    ></Tabs>
  );
}
