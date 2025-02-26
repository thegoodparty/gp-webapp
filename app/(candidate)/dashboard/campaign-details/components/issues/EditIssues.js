'use client';
import WarningButton from '@shared/buttons/WarningButton';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import H2 from '@shared/typography/H2';
import { revalidateCandidates } from 'helpers/cacheHelper';
import { useState } from 'react';
import CandidateIssueSelector from './CandidateIssueSelector';
import EditCandidatePosition from './EditCandidatePosition';
import { combinePositions } from './IssuesList';
import { Draggable } from 'react-drag-reorder';
import LoadingAnimation from '@shared/utils/LoadingAnimation';
import SuggestedIssues from './SuggestedIssues';
import {
  loadCandidatePosition,
  saveCandidatePosition,
} from 'app/(candidate)/dashboard/campaign-details/components/issues/issuesUtils';

export default function EditIssues(props) {
  const {
    campaign,
    positions,
    candidate,
    candidatePositions,
    isStaged,
    saveCallback,
    hideTitle = false,
    noDrag = false,
  } = props;

  const combined = combinePositions(candidatePositions, campaign?.customIssues);
  const [state, setState] = useState(combined);
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [suggested, setSuggested] = useState(false);

  const Wrapper = ({ children, onPosChange }) => {
    if (isStaged || noDrag) {
      return <div>{children}</div>;
    }
    return <Draggable onPosChange={onPosChange}>{children}</Draggable>;
  };

  const onAddPosition = async (
    position,
    candidatePosition,
    customTitle,
    order,
  ) => {
    let maxOrder = order;
    if (state?.length > 0) {
      //last element should have the max order;
      const last = state[state.length - 1];
      if (last.order >= order) {
        maxOrder = last.order + 1;
      }
    }
    if (customTitle !== '') {
      await handleCustomIssue(candidatePosition, customTitle, maxOrder);
    } else {
      await saveCandidatePosition({
        description: candidatePosition,
        campaignId: campaign.id,
        positionId: position.id,
        topIssueId: position.topIssue?.id,
        order: maxOrder,
      });
      await loadPositions();
      await revalidateCandidates();
      // }
    }
  };
  const remainingSlotsCount = Math.max(0, 3 - (state?.length || 0));
  const remainingSlots = [];
  for (let i = 0; i < remainingSlotsCount; i++) {
    remainingSlots.push(i + 1);
  }

  const loadPositions = async () => {
    await revalidateCandidates();
    const candidatePositions = await loadCandidatePosition(campaign.id);
    setState(candidatePositions);
  };

  const handleCustomIssue = async (candidatePosition, customTitle, order) => {
    let entity = isStaged && campaign ? campaign : candidate;
    let customIssues = entity.customIssues || [];

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

  const handlePosChange = async (currentPos, newPos) => {
    if (currentPos !== newPos) {
      setSaving(true);
      await handleReorderSave(state[currentPos], newPos);
      await handleReorderSave(state[newPos], currentPos);
      if (state?.length === 3) {
        const indexes = [0, 1, 2];
        indexes.splice(currentPos, 1);
        indexes.splice(newPos, 1);
        const missingIndex = indexes[0];
        await handleReorderSave(state[missingIndex], state[missingIndex].order);
      }
      await revalidateCandidates();
      window.location.reload();
    }
  };

  const handleReorderSave = async (pos, newOrder) => {
    if (pos.isCustom) {
      await handleCustomReorder(pos, newOrder);
    } else {
      await updateCandidatePosition(pos.id, newOrder);
    }
  };

  const handleCustomReorder = async (pos, newOrder) => {
    let customIssues = candidate.customIssues;
    let index;
    for (let i = 0; i < customIssues?.length; i++) {
      if (customIssues[i].position === pos.description) {
        index = i;
        break;
      }
    }
    if (typeof index !== 'undefined') {
      customIssues[index].order = newOrder;
      await saveCallback({
        ...candidate,
        customIssues,
      });
      await revalidateCandidates();
    }
  };

  const handleSuggested = (issue) => {
    setShowAdd(true);
    setSuggested(issue);
  };
  return (
    <div>
      {!hideTitle && <H1>Add 3 Issues</H1>}
      <Body1 className="mt-3 mb-6">
        Select the issues that resonate deeply with you. These will form the
        foundation of your campaign and your connection with the community.
        <br />
        <br />
        {!isStaged && !noDrag && (
          <strong>Drag and drop the issues to reorder</strong>
        )}
      </Body1>
      <SuggestedIssues
        campaign={campaign}
        suggestedCallback={handleSuggested}
      />
      {saving ? (
        <LoadingAnimation
          title="Saving..."
          label="This make take a few seconds."
        />
      ) : (
        <>
          <Wrapper onPosChange={handlePosChange}>
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
          </Wrapper>
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
                        suggested={suggested}
                        onSaveCallback={(
                          position,
                          candidatePosition,
                          customTitle,
                        ) => {
                          onAddPosition(
                            position,
                            candidatePosition,
                            customTitle,
                            num + (state?.length || 0),
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
        </>
      )}
    </div>
  );
}
