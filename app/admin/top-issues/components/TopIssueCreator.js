'use client';
import { useTopIssues } from './UseTopIssuesContext';
import React, { useState } from 'react';
import { SVGIconChooser } from './SVGIconChooser';
import TextField from '@shared/inputs/TextField';
import gpApi from '../../../../gpApi';
import gpFetch from '../../../../gpApi/gpFetch';
import { FaCaretDown, FaCaretRight } from 'react-icons/fa';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { useSnackbar } from 'helpers/useSnackbar';

export const createTopIssue = async (name, icon) => {
  const api = gpApi.admin.topIssues.create;
  const payload = {
    name,
    ...(icon ? { icon } : {}),
  };
  return await gpFetch(api, payload);
};

export const TopIssueCreator = ({}) => {
  const [topIssues, setTopIssues] = useTopIssues();
  const { successSnackbar } = useSnackbar();
  const [addNewIssue, setAddNewIssue] = useState(false);
  const [topIssueName, setTopIssueName] = useState('');
  const [svgData, setSvgData] = useState(null);

  const handleCreate = async () => {
    successSnackbar('creating issue');
    setTopIssues([await createTopIssue(topIssueName, svgData), ...topIssues]);
    setAddNewIssue(false);
    setTopIssueName('');
  };

  return (
    <>
      <PrimaryButton
        onClick={() => {
          setAddNewIssue(!addNewIssue);
        }}
        className="font-black align-middle"
      >
        Add a Top Issue{' '}
        {addNewIssue ? (
          <FaCaretDown className="inline-block" />
        ) : (
          <FaCaretRight className="inline-block" />
        )}
      </PrimaryButton>

      {addNewIssue && (
        <div className="flex mt-4 items-center">
          <SVGIconChooser svgData={svgData} setSvgData={setSvgData} />
          <TextField
            className="mx-4"
            fullWidth
            primary
            label="Top Issue Name"
            value={topIssueName}
            onChange={(e) => setTopIssueName(e.target.value)}
          />
          <div className="text-right">
            <PrimaryButton
              disabled={topIssueName === ''}
              onClick={handleCreate}
              className="font-black"
            >
              Save
            </PrimaryButton>
          </div>
        </div>
      )}
    </>
  );
};
