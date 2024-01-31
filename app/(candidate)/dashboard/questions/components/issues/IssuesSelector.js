'use client';
import H6 from '@shared/typography/H6';
import Tabs from '@shared/utils/Tabs';
import { useState } from 'react';
import IssuesList from './IssuesList';
export default function IssuesSelector(props) {
  const [tab, setTab] = useState(0);
  const labels = [
    <H6 key="issue1">Issue One</H6>,
    <H6 key="issue2">Issue Two</H6>,
    <H6 key="issue3">Issue Three</H6>,
  ];

  const panels = [
    <div key="1">
      <IssuesList {...props} />
    </div>,
    <div key="2">2</div>,
    <div key="3">3</div>,
  ];

  const changeTabCallback = (index) => {
    setTab(index);
  };

  return (
    <div>
      <Tabs
        tabLabels={labels}
        tabPanels={panels}
        activeTab={tab}
        changeCallback={changeTabCallback}
        centered
        color="#8257FF"
        size="large"
      />
    </div>
  );
}
