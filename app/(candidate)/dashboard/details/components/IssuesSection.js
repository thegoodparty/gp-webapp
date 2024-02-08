'use client';

import H3 from '@shared/typography/H3';

import EditIssues from './issues/EditIssues';
import IssuesSelector from '../../questions/components/issues/IssuesSelector';
import { loadCandidatePosition } from '../../questions/components/QuestionsPage';
import { useState } from 'react';

export default function IssuesSection(props) {
  const [candidatePositions, setCandidatePositions] = useState(
    props.candidatePositions,
  );
  const completeCallback = async () => {
    const res = await loadCandidatePosition(props.campaign.slug);
    setCandidatePositions(res.candidatePositions);
  };
  return (
    <section className="border-t pt-6 border-gray-600">
      <H3>Your Top Issues</H3>
      <IssuesSelector
        {...props}
        standaloneMode
        completeCallback={completeCallback}
        candidatePositions={candidatePositions}
        updatePositionsCallback={completeCallback}
      />

      {/* <EditIssues {...props} hideTitle noDrag /> */}
    </section>
  );
}
