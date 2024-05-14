'use client';
import Tabs from '@shared/utils/Tabs';
import { useState } from 'react';
import CandidateInfo from './CandidateInfo';
import Surveys from './Surveys';
import TempScript from './TempScript';

export default function TabsSection(props) {
  const [tab, setTab] = useState(0);
  const labels = [
    <div key="issues">Voter Issues</div>,
    <div key="script">Script</div>,
    <div key="info">Candidate Info</div>,
  ];

  const panels = [
    <Surveys {...props} key="issues-tab" />,
    <TempScript {...props} key="script-tab" />,
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
