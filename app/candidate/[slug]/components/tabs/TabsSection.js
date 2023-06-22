'use client';
import Tabs from '@shared/utils/Tabs';
import { useState } from 'react';
import { AiOutlineFlag } from 'react-icons/ai';
import { RiGroupLine, RiLandscapeLine } from 'react-icons/ri';
import { TbBrain } from 'react-icons/tb';
import EndorsementsTab from '../endorsements/EndorsementsTab';
import InfoTab from './InfoTab';
import IssuesTab from '../issues/IssuesTab';
import OverviewTab from './OverviewTab';

const labels = [
  <div key="overview" className="flex flex-col lg:flex-row items-center">
    <AiOutlineFlag />
    <div className="ml-2 font-medium text-xs lg:text-base">Overview</div>
  </div>,
  <div key="issues" className="flex flex-col lg:flex-row items-center">
    <RiLandscapeLine />
    <div className="ml-2 font-medium text-xs lg:text-base">Issues</div>
  </div>,
  <div key="endorsements" className="flex flex-col lg:flex-row items-center">
    <TbBrain />
    <div className="ml-2 font-medium text-xs lg:text-base">Endorsements</div>
  </div>,
  <div key="info" className="flex flex-col lg:flex-row items-center">
    <RiGroupLine />
    <div className="ml-2 font-medium text-xs lg:text-base">Info</div>
  </div>,
];

export const TABS_ENUM = {
  overview: 0,
  issues: 1,
  endorsements: 2,
  info: 3,
};

export default function TabsSection(props) {
  const [tab, setTab] = useState(0);
  const changeTabCallback = (index) => {
    setTab(index);
  };
  const panels = [
    <div key="1">
      <OverviewTab {...props} changeTabCallback={changeTabCallback} />
    </div>,
    <div key="2">
      <IssuesTab {...props} />
    </div>,
    <div key="3">
      <EndorsementsTab {...props} />
    </div>,
    <div key="4">
      <InfoTab {...props} />
    </div>,
  ];
  return (
    <section className="mt-14">
      <Tabs
        tabLabels={labels}
        tabPanels={panels}
        activeTab={tab}
        changeCallback={changeTabCallback}
      />
    </section>
  );
}
