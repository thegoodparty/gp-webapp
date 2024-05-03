'use client';
import IssueItemEditor from 'app/(candidate)/dashboard/questions/components/issues/IssueItemEditor';
import { useEffect, useState } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import AddCustomIssue from './AddCustomIssue';
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { findExistingCustomIssueIndex } from './findExistingCustomIssueIndex';
import { deleteCustomIssue } from './customIssuesUtils';
import { IssuesSearch } from './IssuesSearch';
import { IssuesSelectList } from './IssuesSelectList';
import { AddNewIssueTrigger } from './AddNewIssueTrigger';

export async function saveCandidatePosition({
  description,
  campaignSlug,
  positionId,
  topIssueId,
}) {
  try {
    const api = gpApi.campaign.candidatePosition.create;
    const payload = {
      description,
      campaignSlug,
      positionId,
      topIssueId,
      // TODO: remove this once the Sails "input" value for `order` is removed or made optional
      order: 0,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at saveCandidatePosition', e);
    return false;
  }
}

async function deleteCandidatePosition(id) {
  try {
    const api = gpApi.campaign.candidatePosition.delete;
    const payload = {
      id,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at saveCandidatePosition', e);
    return false;
  }
}

export default function IssuesList({
  nextCallback,
  candidatePositions,
  editIssuePosition,
  campaign: incomingCampaign,
  topIssues,
  setEditIssuePosition,
}) {
  const [campaign, setCampaign] = useState(incomingCampaign);
  const [issues, setIssues] = useState(topIssues || []);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const editingCustomIssue =
    editIssuePosition && editIssuePosition.type === 'custom';
  const showSelectList = !selectedIssue;

  useEffect(() => {
    if (editIssuePosition) {
      setSelectedIssue(
        editIssuePosition.type === 'custom'
          ? 'custom'
          : editIssuePosition.topIssue,
      );
    }
  }, [editIssuePosition]);

  const selectIssueCallback = (issue) => {
    setSelectedIssue(issue);
    if (!issue && !editIssuePosition) {
    }
  };

  const updateCustomIssuesState = (customIssues) =>
    setCampaign({
      ...campaign,
      details: {
        ...campaign.details,
        customIssues,
      },
    });

  const saveCallback = async (position, issue, candidatePosition) => {
    // if candidate position already exists in this order, delete it
    editIssuePosition?.id &&
      (await deleteCandidatePosition(editIssuePosition.id));

    if (editIssuePosition?.type === 'custom') {
      const existingIndex = findExistingCustomIssueIndex(
        campaign,
        editIssuePosition,
      );
      const currentCustomIssues = campaign.details.customIssues || [];
      const updatedCustomIssues =
        existingIndex !== -1
          ? await deleteCustomIssue(existingIndex, currentCustomIssues)
          : currentCustomIssues;
      updateCustomIssuesState(updatedCustomIssues);
    }
    await saveCandidatePosition({
      description: candidatePosition,
      campaignSlug: campaign.slug,
      positionId: position.id,
      topIssueId: issue.id,
    });
    nextCallback();
  };

  const handleSaveCustom = async () => {
    // if candidate position already exists in this order, delete it
    if (editIssuePosition?.id) {
      await deleteCandidatePosition(editIssuePosition.id);
    }
    const { campaign } = await getCampaign();
    setCampaign(campaign);

    nextCallback();
  };

  const filterIssues = (value) => {
    if (value === '') {
      setIssues(topIssues);
    } else if (issues && typeof issues.filter === 'function') {
      const filtered = issues.filter((option) =>
        option.name.toLowerCase().includes(value.toLowerCase()),
      );
      setIssues(filtered);
    }
  };

  return (
    <div className=" max-w-3xl mx-auto">
      {!editingCustomIssue && !selectedIssue && (
        <div className="pt-4 pb-2">
          <IssuesSearch
            {...{
              issues: issues,
              onInputChange: filterIssues,
            }}
          />
        </div>
      )}

      {showSelectList && (
        <>
          <IssuesSelectList
            issues={issues}
            handleSelectIssue={selectIssueCallback}
          />
          <AddNewIssueTrigger onClick={() => setSelectedIssue('custom')} />
        </>
      )}

      {selectedIssue &&
        (selectedIssue === 'custom' ? (
          <AddCustomIssue
            campaign={campaign}
            selectIssueCallback={selectIssueCallback}
            saveCallback={handleSaveCustom}
            editIssuePosition={editIssuePosition}
            setEditIssuePosition={setEditIssuePosition}
          />
        ) : (
          <IssueItemEditor
            issue={issues.find(
              ({ id: issueId }) => issueId === selectedIssue.id,
            )}
            selectIssueCallback={selectIssueCallback}
            saveCallback={saveCallback}
            candidatePositions={candidatePositions}
            editIssuePosition={editIssuePosition}
            setEditIssuePosition={setEditIssuePosition}
          />
        ))}
    </div>
  );
}
