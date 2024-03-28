'use client';
import Tabs from '@shared/utils/Tabs';
import { useState } from 'react';
import CandidateInfo from './CandidateInfo';

export default function TabsSection(props) {
  const [tab, setTab] = useState(0);
  const labels = [
    <div key="issues">Voter Issues</div>,
    <div key="info">Candidate Info</div>,
  ];

  const panels = [
    <div key="issues-tab">Issues</div>,
    <CandidateInfo {...props} key="info-tab" />,
  ];
  const changeTabCallback = (index) => {
    setTab(index);
  };
  return (
    <Tabs
      tabLabels={labels}
      tabPanels={panels}
      activeTab={tab}
      changeCallback={changeTabCallback}
      centered
    />
  );
}
