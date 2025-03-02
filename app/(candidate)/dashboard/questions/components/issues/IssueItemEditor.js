'use client';
import { useEffect, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { IssuePositionsList } from 'app/(candidate)/dashboard/questions/components/issues/IssuePositionsList';
import { IssueItemLabel } from 'app/(candidate)/dashboard/questions/components/issues/IssueItemLabel';
import { IssueEditorButtons } from 'app/(candidate)/dashboard/questions/components/issues/IssueEditorButtons';
import { CandidatePositionStatement } from 'app/(candidate)/dashboard/questions/components/issues/CandidatePositionStatement';
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper';

export default function IssueItemEditor({
  issue,
  selectIssueCallback = (v) => {},
  saveCallback = (position, issue, candidatePosition) => {},
  editIssuePosition,
  setEditIssuePosition = (v) => {},
}) {
  const { name, positions } = issue;
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [candidatePosition, setCandidatePosition] = useState('');
  const saveAllowed = candidatePosition !== '' && selectedPosition;

  useEffect(() => {
    if (editIssuePosition?.topIssue?.id === issue.id) {
      setSelectedPosition(editIssuePosition.position);
      setCandidatePosition(editIssuePosition.description);
    }
  }, [editIssuePosition]);

  if (!issue || issue.positions?.length === 0) {
    return null;
  }

  const handleSelectPosition = (position) => {
    if (selectedPosition?.id === position.id) {
      setSelectedPosition(null);
    } else {
      setSelectedPosition(position);
    }
  };

  const handleSave = () => {
    if (!saveAllowed) {
      return;
    }
    saveCallback(selectedPosition, issue, candidatePosition);
  };

  const handleAnotherIssue = () => {
    selectIssueCallback(null);
    setSelectedPosition(null);
    setCandidatePosition('');
  };

  const onCancel = () => {
    trackEvent(EVENTS.Profile.TopIssues.CancelEdit);
    setEditIssuePosition(null);
  };

  return (
    issue &&
    positions?.length && (
      <>
        <div
          className="flex my-2 items-center font-medium text-sm cursor-pointer"
          onClick={handleAnotherIssue}
        >
          <FaChevronLeft />
          <div className="ml-2 ">Choose another issue</div>
        </div>
        <div className="p-4 rounded-lg mt-2 bg-tertiary-light">
          <IssueItemLabel name={name} numPositions={positions?.length} />
        </div>
        <div>
          <div className="my-4 font-semibold">
            Select your positions on this issue
          </div>
          <IssuePositionsList
            positions={positions}
            selectedPosition={selectedPosition}
            handleSelectPosition={handleSelectPosition}
          />
          <div className="mt-10">
            <CandidatePositionStatement
              candidatePosition={candidatePosition}
              setCandidatePosition={setCandidatePosition}
            />
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <IssueEditorButtons
            disableSave={!saveAllowed}
            editIssuePosition={editIssuePosition}
            onSave={handleSave}
            onCancel={onCancel}
          />
        </div>
      </>
    )
  );
}
