'use client';
import H6 from '@shared/typography/H6';
import Tabs from '@shared/utils/Tabs';
import { useState } from 'react';
import IssuesList from './IssuesList';
export default function IssuesSelector(props) {
  const {
    completeCallback,
    standaloneMode,
    updatePositionsCallback,
    candidatePositions,
    campaign,
  } = props;
  const [tab, setTab] = useState(0);
  const labels = [
    <H6 key="issue1">Issue One</H6>,
    <H6 key="issue2">Issue Two</H6>,
    <H6 key="issue3">Issue Three</H6>,
  ];
  const nextCallback = () => {
    if (tab < 2) {
      setTab(tab + 1);
      if (updatePositionsCallback) {
        updatePositionsCallback();
      }
    } else {
      const combinedIssuedCount =
        (candidatePositions?.length || 0) +
        (campaign?.customIssues?.length || 0);
      updatePositionsCallback();
      if (combinedIssuedCount > 2) {
        completeCallback('issues');
      }
    }
  };

  const panels = [1, 2, 3].map((order) => (
    <IssuesList
      {...props}
      nextCallback={nextCallback}
      order={order}
      key={order}
      saveButton={order === 3 && standaloneMode}
    />
  ));

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
