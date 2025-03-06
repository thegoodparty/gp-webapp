'use client';
import IssueItemEditor from 'app/(candidate)/dashboard/questions/components/issues/IssueItemEditor';
import { useEffect, useState } from 'react';
import AddCustomIssue from './AddCustomIssue';
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import {
  deleteCandidatePosition,
  filterIssues,
  handleDeleteCustomIssue,
  saveCandidatePosition,
} from 'app/(candidate)/dashboard/campaign-details/components/issues/issuesUtils';
import { IssuesSearch } from './IssuesSearch';
import { IssuesSelectList } from './IssuesSelectList';
import { AddNewIssueTrigger } from './AddNewIssueTrigger';

export default function IssuesList({
  nextCallback,
  candidatePositions,
  editIssuePosition,
  campaign: incomingCampaign,
  topIssues,
  setEditIssuePosition,
}) {
  const [campaign, setCampaign] = useState(incomingCampaign);
  const [filterValue, setFilterValue] = useState('');
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
    setFilterValue('');
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
      (await deleteCandidatePosition(editIssuePosition.id, campaign.id));

    if (editIssuePosition?.type === 'custom') {
      updateCustomIssuesState(await handleDeleteCustomIssue(editIssuePosition));
    }
    await saveCandidatePosition({
      description: candidatePosition,
      campaignId: campaign.id,
      positionId: position.id,
      topIssueId: issue.id,
    });
    nextCallback();
  };

  const handleSaveCustom = async () => {
    // if candidate position already exists in this order, delete it
    if (editIssuePosition?.id) {
      await deleteCandidatePosition(editIssuePosition.id, campaign.id);
    }
    const updatedCampaign = await getCampaign();
    setCampaign(updatedCampaign);

    nextCallback();
  };

  const filteredIssues = filterIssues(filterValue, topIssues);

  return (
    <div className=" max-w-3xl mx-auto">
      {!editingCustomIssue && !selectedIssue && (
        <div className="pt-4 pb-2">
          <IssuesSearch
            {...{
              issues: filteredIssues,
              onInputChange: setFilterValue,
            }}
          />
        </div>
      )}

      {showSelectList && (
        <>
          <IssuesSelectList
            issues={filteredIssues}
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
            issue={filteredIssues.find(
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
