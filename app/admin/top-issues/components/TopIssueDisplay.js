'use client'

import React, { useState } from 'react';
import { SVGIconChooser } from '@shared/buttons/SVGIconChooser';
import TextField from '@shared/inputs/TextField';
import { ButtonGroup } from '@mui/material';
import Button from '@mui/material/Button';
import { FaCheck, FaEdit } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import Image from 'next/image';
import IconButton from '@mui/material/IconButton';
import { updateTopIssue } from './TopIssuesList';
import { useTopIssues } from './UseTopIssuesContext';

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
    const { icon } = await updateTopIssue({
      ...issue,
      ...updateIssue,
    });
    const issueIndx = topIssues.findIndex(({ id }) => id === issue.id);
    setTopIssues(
      [
        ...topIssues.slice(0, issueIndx),
        {
          ...updateIssue,
          ...(icon ? { icon } : {}),
        },
        ...topIssues.slice(issueIndx + 1),
      ],
    );
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
      <ButtonGroup
        className='mr-2'
        variant='outlined'
      >
        <Button onClick={handleTopIssueUpdate(issue)}>
          <FaCheck /> Save
        </Button>
        <Button onClick={handleClearIssueEdit}>
          <FaXmark /> Cancel
        </Button>
      </ButtonGroup>
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
