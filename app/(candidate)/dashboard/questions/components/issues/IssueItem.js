'use client';

import { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa6';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';

export default function IssueItem({ topIssue }) {
  const [selectedIssue, setSelectedIssue] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(false);

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
  console.log('selected', selectedIssue);
  return (
    <>
      {selectedIssue ? (
        <>
          <div
            className="flex my-2 items-center font-medium text-sm cursor-pointer"
            onClick={() => {
              setSelectedIssue(false);
              setSelectedPosition(false);
            }}
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
                className={`flex items-center p-4 rounded-lg bg-slate-100 border-2 border-slate-300 mb-3 ${
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
          </div>
        </>
      ) : (
        <div
          key={topIssue.id}
          className={`flex justify-between items-center  p-4 rounded-lg mt-2 cursor-pointer transition-colors hover:bg-purple-50 ${
            selectedIssue ? 'bg-purple-100' : 'bg-slate-50'
          }`}
          onClick={() => {
            setSelectedIssue(topIssue);
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
