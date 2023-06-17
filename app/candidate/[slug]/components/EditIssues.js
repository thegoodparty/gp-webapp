'use client';
import WarningButton from '@shared/buttons/WarningButton';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import H2 from '@shared/typography/H2';
import IssuesSelector from 'app/(candidate)/onboarding/[slug]/details/[step]/components/IssuesSelector';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';
import CandidateIssuesSelector from './CandidateIssueSelector';
import EditCandidatePosition from './EditCandidatePosition';

export async function saveCandidatePosition({
  description,
  candidateId,
  positionId,
  topIssueId,
  order,
}) {
  try {
    const api = gpApi.campaign.candidatePosition.create;
    const payload = {
      description,
      candidateId,
      positionId,
      topIssueId,
      order,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at saveCandidatePosition', e);
    return false;
  }
}

export async function loadCandidatePosition(slug) {
  try {
    const api = gpApi.campaign.candidatePosition.find;
    const payload = {
      slug,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at loadCandidatePosition', e);
    return false;
  }
}

export default function EditIssues(props) {
  const { campaign, positions, candidate, candidatePositions, isStaged } =
    props;

  const [state, setState] = useState(candidatePositions);
  const [showAdd, setShowAdd] = useState(false);
  console.log('campaign.details?.topIssues', campaign.details?.topIssues);
  console.log('candidatePositions', candidatePositions);
  const onAddPosition = async (position, candidatePosition, order) => {
    await saveCandidatePosition({
      description: candidatePosition,
      candidateId: candidate.id,
      positionId: position.id,
      topIssueId: position.topIssue?.id,
      order,
    });
    await loadPositions();
  };
  const remainingSlotsCount = Math.max(0, 3 - state.length);
  const remainingSlots = [];
  for (let i = 0; i < remainingSlotsCount; i++) {
    remainingSlots.push(i + 1);
  }

  const loadPositions = async () => {
    const res = await loadCandidatePosition(candidate.slug);
    setState(res.candidatePositions);
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
          {state &&
            state.map((candidatePosition, index) => (
              <EditCandidatePosition
                candidatePosition={candidatePosition}
                index={index}
                key={candidatePosition.id}
                updatePositionsCallback={loadPositions}
              />
            ))}
          {remainingSlots.map((num) => (
            <div
              className="border-2 py-5 px-8 mb-5 rounded-xl border-dashed border-slate-900 min-h-[150px] bg-slate-100"
              key={num}
            >
              <H2 className="mb-5">Issue {num + state.length}</H2>

              {num === 1 && (
                <>
                  {showAdd ? (
                    <div>
                      {candidate ? (
                        <CandidateIssuesSelector
                          candidate={candidate}
                          positions={positions}
                          onSaveCallback={(position, candidatePosition) => {
                            onAddPosition(position, candidatePosition, num);
                          }}
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
