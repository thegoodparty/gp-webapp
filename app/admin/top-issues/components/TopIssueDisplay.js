'use client';

import { useState } from 'react';
import TextField from '@shared/inputs/TextField';
import { FaCheck, FaEdit } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import IconButton from '@mui/material/IconButton';
import { updateTopIssue } from './TopIssuesList';
import { useTopIssues } from './UseTopIssuesContext';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import { SvgIconImage } from './SvgIconImage';

const insertItemInArray = (arr, item, placement) => [
  ...arr.slice(0, placement),
  item,
  ...arr.slice(placement + 1),
];

export const TopIssueDisplay = ({ issue }) => {
  const [topIssues, setTopIssues] = useTopIssues();
  const [editTopIssueId, setEditTopIssueId] = useState(null);
  const [editTopIssueName, setEditTopIssueName] = useState(null);
  const [editTopIssueIcon, setEditTopIssueIcon] = useState(null);

  const handleClearIssueEdit = () => {
    setEditTopIssueId(null);
    setEditTopIssueName(null);
    setEditTopIssueIcon(null);
  };

  return editTopIssueId === issue.id ? (
    <>
      <TextField
        className="mx-2"
        fullWidth={true}
        primary={true}
        size="small"
        label="Top Issue Name"
        value={editTopIssueName}
        onChange={(e) => setEditTopIssueName(e.target.value)}
      />
      <div className="flex flex-row">
        <SecondaryButton
          variant="outlined"
          size="medium"
          onClick={async () => {
            const updateIssue = {
              ...issue,
              id: editTopIssueId,
              name: editTopIssueName,
              icon: editTopIssueIcon,
            };
            await updateTopIssue(updateIssue);
            setTopIssues(
              insertItemInArray(
                topIssues,
                updateIssue,
                topIssues.findIndex(({ id }) => id === issue.id),
              ),
            );
            handleClearIssueEdit();
          }}
          className={{ 'mr-2': true }}
        >
          <div className="flex items-center whitespace-nowrap h-6">
            <FaCheck className="text-sm mr-1" />
            <div>Save</div>
          </div>
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          size="medium"
          onClick={handleClearIssueEdit}
        >
          <div className="flex items-center whitespace-nowrap h-6">
            <FaXmark className="text-sm mr-1" />
            <div>Cancel</div>
          </div>
        </SecondaryButton>
      </div>
    </>
  ) : (
    <>
      {issue.icon && <SvgIconImage src={issue.icon} />}
      <strong>&nbsp; {issue.name}</strong>
      <IconButton
        size="small"
        onClick={() => {
          setEditTopIssueId(issue.id);
          setEditTopIssueName(issue.name);
          setEditTopIssueIcon(issue.icon);
        }}
      >
        <FaEdit />
      </IconButton>
    </>
  );
};
