'use client';
import RaceCard from './RaceCard';
import Body1 from '@shared/typography/Body1';
import Sticky from 'react-stickynode';
import Tabs from '@shared/utils/Tabs';
import { useState } from 'react';
import TextField from '@shared/inputs/TextField';

const panels = [
  <div key="tab1" className="w-1/3">
    1
  </div>,
  <div key="tab2" className="w-1/3">
    2
  </div>,
  <div key="tab3" className="w-1/3">
    3
  </div>,
];

export default function BallotRaces({ races, campaign }) {
  const [tab, setTab] = useState(0);
  const [zip, setZip] = useState(campaign.details.zip);
  const changeTabCallback = (index) => {
    setTab(index);
  };
  const labels = ['Local (1)', 'State (3)', 'Federal (1)'];
  return (
    <section className="mb-10">
      <Body1>
        With over 500,000 local, state, and federal offices available, it can be
        overwhelming, but we&apos;ve narrowed it down based on your residency.
      </Body1>
      <Body1 className="font-semibold mt-16  mb-4 ">
        Where do you want to run?{' '}
        <span className="inline-block ml-2 text-blue-600 font-medium cursor-pointer hover:underline">
          change
        </span>
      </Body1>
      <div className="bg-slate-50 p-4 rounded text-indigo-50 font-semibold">
        {zip}
      </div>
      <Body1 className="font-semibold mt-16  mb-4">
        Where do you want to run?
      </Body1>
      <Sticky top={60}>
        <div className="bg-white pt-10 pb-2">
          <Tabs
            tabLabels={labels}
            tabPanels={panels}
            activeTab={tab}
            changeCallback={changeTabCallback}
            variant="fullWidth"
            centered
          />
        </div>
      </Sticky>
      <div className="">
        {races.map((race) => (
          <RaceCard key={race.node?.election?.id} race={race} />
        ))}
      </div>
    </section>
  );
}
