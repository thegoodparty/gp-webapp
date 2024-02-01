'use client';

import { TextField } from '@mui/material';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { useEffect, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa6';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';

export default function IssueItem({
  topIssue,
  selectIssueCallback,
  saveCallback,
  initialSaved,
}) {
  const [selectedIssue, setSelectedIssue] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(false);
  const [candidatePosition, setCandidatePosition] = useState('');
  useEffect(() => {
    if (initialSaved) {
      setSelectedIssue(initialSaved.topIssue);
      setSelectedPosition(initialSaved.position);
      setCandidatePosition(initialSaved.description);
    }
  }, [initialSaved]);

  if (!topIssue || topIssue.positions?.length === 0) {
    return null;
  }
  const { name, positions } = topIssue;

  const handleSelectPosition = (position) => {
    if (selectedPosition.id === position.id) {
      setSelectedPosition(false);
    } else {
      setSelectedPosition(position);
    }
  };
  const handleSelectIssue = (issue) => {
    setSelectedIssue(issue);
    selectIssueCallback(issue);
  };

  const handleSave = () => {
    if (!canSave()) {
      return;
    }
    saveCallback(selectedPosition, selectedIssue, candidatePosition);
  };

  const canSave = () => {
    return candidatePosition !== '' && selectedPosition && selectedIssue;
  };
  const handleAnotherIssue = () => {
    handleSelectIssue(false);
    setSelectedPosition(false);
    setCandidatePosition('');
  };

  return (
    <>
      {selectedIssue ? (
        <>
          <div
            className="flex my-2 items-center font-medium text-sm cursor-pointer"
            onClick={handleAnotherIssue}
          >
            <FaChevronLeft />
            <div className="ml-2 ">Choose another issue</div>
          </div>
          <div className="p-4 rounded-lg mt-2 bg-purple-100">
            <div className="font-medium">
              {name} ({positions?.length || 0})
            </div>
          </div>
          <div>
            <div className="my-4 font-semibold">
              Select your positions on this issue
            </div>
            {positions.map((position) => (
              <div
                key={position.id}
                className={`flex items-center p-4 cursor-pointer rounded-lg bg-slate-100 border-2 border-slate-300 mb-3 transition-colors hover:border-purple-200 ${
                  selectedPosition.id === position.id ? 'bg-purple-50' : ''
                }`}
                onClick={() => {
                  handleSelectPosition(position);
                }}
              >
                {selectedPosition.id === position.id ? (
                  <ImCheckboxChecked className="mr-2" />
                ) : (
                  <ImCheckboxUnchecked className="mr-2" />
                )}
                {position.name}
              </div>
            ))}
            <div className="mt-10">
              <TextField
                label="Your Position"
                placeholder="Write 1 or 2 sentences about your position on this issue…"
                fullWidth
                multiline
                rows={3}
                InputLabelProps={{
                  shrink: true,
                }}
                value={candidatePosition}
                onChange={(e) => {
                  setCandidatePosition(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="mt-10 flex justify-center" onClick={handleSave}>
            <PrimaryButton disabled={!canSave()}>Next</PrimaryButton>
          </div>
        </>
      ) : (
        <div
          key={topIssue.id}
          className={`flex justify-between items-center  p-4 rounded-lg mt-2 cursor-pointer transition-colors hover:bg-purple-50 ${
            selectedIssue ? 'bg-purple-100' : 'bg-slate-50'
          }`}
          onClick={() => {
            handleSelectIssue(topIssue);
          }}
        >
          <div className="font-medium">
            {name} ({positions?.length || 0})
          </div>
          <FaChevronRight
            size={14}
            className={` transition-transform ${
              selectedIssue ? ' rotate-90' : ''
            }`}
          />
        </div>
      )}
    </>
  );
}
