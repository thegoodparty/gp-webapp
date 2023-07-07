'use client';
import WarningButton from '@shared/buttons/WarningButton';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import H2 from '@shared/typography/H2';
import IssuesSelector from 'app/(candidate)/onboarding/[slug]/details/[step]/components/IssuesSelector';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { revalidateCandidates } from 'helpers/cacheHelper';
import { useState } from 'react';
import CandidateIssueSelector from './CandidateIssueSelector';
import EditCandidatePosition from './EditCandidatePosition';
import { combinePositions } from './IssuesList';

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
  const {
    campaign,
    positions,
    candidate,
    candidatePositions,
    isStaged,
    saveCallback,
    hideTitle = false,
  } = props;

  const combined = combinePositions(
    candidatePositions,
    candidate?.customIssues || campaign?.customIssues,
  );
  const [state, setState] = useState(combined);
  const [showAdd, setShowAdd] = useState(false);
  const onAddPosition = async (
    position,
    candidatePosition,
    customTitle,
    order,
  ) => {
    let maxOrder = order;
    if (state.length > 0) {
      //last element should have the max order;
      const last = state[state.length - 1];
      if (last.order >= order) {
        maxOrder = last.order + 1;
      }
    }
    if (customTitle !== '') {
      await handleCustomIssue(candidatePosition, customTitle, maxOrder);
    } else {
      if (isStaged && campaign) {
        const existing = campaign.details?.topIssues || {};
        existing[`position-${position.id}`] = candidatePosition;
        if (!existing.positions) {
          existing.positions = [];
        }
        existing.positions.push(position);
        await saveCallback({
          ...campaign,
          details: {
            ...campaign.details,
            topIssues: existing,
          },
        });
        window.location.reload();
      } else {
        await saveCandidatePosition({
          description: candidatePosition,
          candidateId: candidate.id,
          positionId: position.id,
          topIssueId: position.topIssue?.id,
          order: maxOrder,
        });
        await loadPositions();
        await revalidateCandidates();
      }
    }
  };
  const remainingSlotsCount = Math.max(0, 3 - (state?.length || 0));
  const remainingSlots = [];
  for (let i = 0; i < remainingSlotsCount; i++) {
    remainingSlots.push(i + 1);
  }

  const loadPositions = async () => {
    await revalidateCandidates();
    const res = await loadCandidatePosition(candidate.slug);
    setState(res.candidatePositions);
  };

  const handleCustomIssue = async (candidatePosition, customTitle, order) => {
    let entity = isStaged && campaign ? campaign : candidate;
    let customIssues = entity.customIssues || [];
    console.log('adding position with order', order);

    customIssues.push({
      title: customTitle,
      position: candidatePosition,
      order,
    });
    await saveCallback({
      ...entity,
      customIssues,
    });
    await revalidateCandidates();
    window.location.reload();
  };

  return (
    <div>
      {!hideTitle && <H1>Add 3 Issues</H1>}
      <Body1 className="mt-5 mb-7">
        Select the issues that resonate deeply with you. These will form the
        foundation of your campaign and your connection with the community.
      </Body1>

      {state &&
        state.map((candidatePosition, index) => (
          <EditCandidatePosition
            candidatePosition={candidatePosition}
            index={index}
            key={candidatePosition.id}
            updatePositionsCallback={loadPositions}
            {...props}
          />
        ))}
      {remainingSlots.map((num) => (
        <div
          className="border-2 py-5 px-8 mb-5 rounded-xl border-dashed border-slate-900 min-h-[150px] bg-slate-100"
          key={num}
        >
          <H2 className="mb-5">Issue {num + (state?.length || 0)}</H2>

          {num === 1 && (
            <>
              {showAdd ? (
                <div>
                  <CandidateIssueSelector
                    positions={positions}
                    onSaveCallback={(
                      position,
                      candidatePosition,
                      customTitle,
                    ) => {
                      onAddPosition(
                        position,
                        candidatePosition,
                        customTitle,
                        num + state.length,
                      );
                    }}
                  />
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
    </div>
  );
}
