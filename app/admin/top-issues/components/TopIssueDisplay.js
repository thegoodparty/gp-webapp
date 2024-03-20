'use client'

import React, { useState } from 'react';
import { SVGIconChooser } from './SVGIconChooser';
import TextField from '@shared/inputs/TextField';
import { FaCheck, FaEdit, FaGlobe } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import Image from 'next/image';
import IconButton from '@mui/material/IconButton';
import { updateTopIssue } from './TopIssuesList';
import { useTopIssues } from './UseTopIssuesContext';
import SecondaryButton from '@shared/buttons/SecondaryButton';

const insertItemInArray = (arr, item, placement) => [
  ...arr.slice(0, placement),
  item,
  ...arr.slice(placement + 1)
]

export const TopIssueDisplay = ({
  issue
}) => {
  const [topIssues, setTopIssues] = useTopIssues()
  const [editTopIssueId, setEditTopIssueId] = useState(null);
  const [editTopIssueName, setEditTopIssueName] = useState(null);
  const [editTopIssueIcon, setEditTopIssueIcon] = useState(null);

  const handleIssueEdit = issue => () => {
    setEditTopIssueId(issue.id);
    setEditTopIssueName(issue.name);
    setEditTopIssueIcon(issue.icon);
  };

  const handleClearIssueEdit = () => {
    setEditTopIssueId(null);
    setEditTopIssueName(null);
    setEditTopIssueIcon(null);
  };

  const handleTopIssueUpdate = (issue) => async () => {
    const updateIssue = {
      ...issue,
      id: editTopIssueId,
      name: editTopIssueName,
      icon: editTopIssueIcon,
    };
    await updateTopIssue(updateIssue);
    const issueIndx = topIssues.findIndex(({ id }) => id === issue.id);
    setTopIssues(insertItemInArray(
      topIssues,
      updateIssue,
      issueIndx
    ));
    handleClearIssueEdit();
  };

  return editTopIssueId === issue.id ?
    <>
      <SVGIconChooser
        svgData={editTopIssueIcon}
        setSvgData={data => setEditTopIssueIcon(data)}
      />
      <TextField
        className='mx-2'
        fullWidth={true}
        primary={true}
        size='small'
        label='Top Issue Name'
        value={editTopIssueName}
        onChange={(e) => setEditTopIssueName(e.target.value)}
      />
      <div className="flex flex-row">
        <SecondaryButton
          variant="outlined"
          size="medium"
          onClick={handleTopIssueUpdate(issue)}
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
    </> :
    <>
      {issue.icon &&
        <Image
          width={40}
          height={40}
          src={issue.icon}
        />
      }
      <strong>&nbsp; {issue.name}</strong>
      <IconButton
        size='small'
        onClick={handleIssueEdit(issue)}
      >
        <FaEdit />
      </IconButton>
    </>;
};
