'use client';
import H6 from '@shared/typography/H6';
import Tabs from '@shared/utils/Tabs';
import { useEffect, useState } from 'react';
import IssuesList from './IssuesList';
export default function IssuesSelector(props) {
  const {
    completeCallback,
    standaloneMode,
    updatePositionsCallback,
    candidatePositions,
    campaign,
    startTab = 0,
  } = props;
  const [tab, setTab] = useState(startTab);

  const [panels, setPanels] = useState([]);

  useEffect(() => {
    // make sure the key is different every time
    const randomKey = (Math.random() + 1).toString(36).substring(4);

    const newPanels = [1, 2, 3].map((order) => (
      <IssuesList
        {...props}
        campaign={campaign}
        nextCallback={nextCallback}
        order={order}
        key={`${order}-${randomKey}`}
        saveButton={order === 3 && standaloneMode}
      />
    ));
    setPanels(newPanels);
  }, [campaign]);

  const labels = [
    <H6 key="issue1">Issue One</H6>,
    <H6 key="issue2">Issue Two</H6>,
    <H6 key="issue3">Issue Three</H6>,
  ];
  const nextCallback = async () => {
    if (tab < 2) {
      setTab(tab + 1);
      if (updatePositionsCallback) {
        updatePositionsCallback();
      }
    } else {
      const combinedIssuedCount =
        (candidatePositions?.length || 0) +
        (campaign?.customIssues?.length || 0);
      await updatePositionsCallback();
      if (combinedIssuedCount > 2) {
        await completeCallback('issues');
      }
    }
  };

  // const panels = [1, 2, 3].map((order) => (
  //   <IssuesList
  //     {...props}
  //     campaign={campaign}
  //     nextCallback={nextCallback}
  //     order={order}
  //     key={order}
  //     saveButton={order === 3 && standaloneMode}
  //   />
  // ));

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
