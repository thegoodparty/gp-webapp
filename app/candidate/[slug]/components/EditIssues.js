'use client';
import WarningButton from '@shared/buttons/WarningButton';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import H2 from '@shared/typography/H2';
import IssuesSelector from 'app/(candidate)/onboarding/[slug]/details/[step]/components/IssuesSelector';
import { useState } from 'react';
import CandidateIssuesSelector from './CandidateIssueSelector';

export default function EditIssues(props) {
  const { campaign, positions, candidate, candidatePositions } = props;

  const [state, setState] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const nextIssue = state.length + 1;

  const onAddPosition = (position, candidatePosition) => {
    console.log('pos', position);
    console.log('candidatePosition', candidatePosition);
  };
  return (
    <div>
      <H1>Add 3 Issues</H1>
      <Body1 className="mt-5 mb-7">
        Select the issues that resonate deeply with you. These will form the
        foundation of your campaign and your connection with the community.
      </Body1>
      {candidate ? (
        <>
          {[1, 2, 3].map((num) => (
            <div
              className="border-2 py-5 px-8 mb-5 rounded-xl border-dashed border-slate-900 min-h-[150px] bg-slate-100"
              key={num}
            >
              <H2 className="mb-5">Issue {num}</H2>
              {nextIssue === num && (
                <>
                  {showAdd ? (
                    <div>
                      {candidate ? (
                        <CandidateIssuesSelector
                          candidate={candidate}
                          positions={positions}
                          onSaveCallback={onAddPosition}
                        />
                      ) : null}
                    </div>
                  ) : (
                    <div onClick={() => setShowAdd(true)}>
                      <WarningButton size="medium">+ Add issue</WarningButton>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </>
      ) : (
        <IssuesSelector
          campaign={campaign}
          positions={positions}
          subSectionKey="details"
          onSaveCallback={onSave}
          buttonLabel="SAVE"
        />
      )}
    </div>
  );
}
