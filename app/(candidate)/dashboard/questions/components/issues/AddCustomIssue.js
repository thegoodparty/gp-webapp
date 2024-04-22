'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';
import {
  updateCampaign,
  updateCampaignOld,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { FaCirclePlus } from 'react-icons/fa6';

export default function AddCustomIssue(props) {
  const { selectIssueCallback, saveCallback, campaign, order } = props;
  const findExisting = () => {
    let existingIssue;
    let index = -1;
    if (campaign.details.customIssues) {
      for (let i = 0; i < campaign.details.customIssues.length; i++) {
        if (campaign.details.customIssues[i].order === order) {
          existingIssue = campaign.details.customIssues[i];
          selectIssueCallback('custom');
          index = i;
          break;
        }
      }
      return { existingIssue, index };
    }
    return { index };
  };
  let { existingIssue } = findExisting() || {};

  const [selectCustom, setSelectCustom] = useState(
    existingIssue ? 'custom' : false,
  );
  const [title, setTitle] = useState(existingIssue ? existingIssue.title : '');
  const [position, setPosition] = useState(
    existingIssue ? existingIssue.position : '',
  );

  const handleSelectCustom = () => {
    setSelectCustom(true);
    selectIssueCallback('custom');
  };

  const handleAnotherIssue = () => {
    setSelectCustom(false);
    selectIssueCallback(false);
  };

  const canSave = () => {
    return selectCustom && title !== '' && position !== '';
  };
  const handleSave = async () => {
    if (!canSave()) {
      return;
    }
    const customIssues = campaign.details.customIssues || [];

    let { index } = findExisting();
    if (index !== -1) {
      customIssues[index] = {
        title,
        position,
        order,
      };
    } else {
      customIssues.push({
        title,
        position,
        order,
      });
    }
    await updateCampaign(['details.customIssues'], [customIssues]);
    await saveCallback(customIssues);
  };

  return (
    <>
      {selectCustom && (
        <div
          className="flex my-2 items-center font-medium text-sm cursor-pointer"
          onClick={handleAnotherIssue}
        >
          <FaChevronLeft />
          <div className="ml-2 ">Choose another issue</div>
        </div>
      )}
      <div
        className="p-4 rounded-lg mt-2 bg-slate-700  text-white font-semibold flex items-center cursor-pointer"
        onClick={handleSelectCustom}
      >
        <FaCirclePlus />
        <div className="ml-2">Add a new issue…</div>
      </div>
      {selectCustom && (
        <>
          <div className="mt-10">
            <TextField
              label="Name of issue"
              fullWidth
              value={title}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div className="mt-10">
            <TextField
              label="Position on issue"
              placeholder="Write 1 or 2 sentences about your position on this issue..."
              fullWidth
              value={position}
              multiline
              rows={6}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setPosition(e.target.value);
              }}
            />
          </div>
          <div className="mt-10 flex justify-center" onClick={handleSave}>
            <PrimaryButton disabled={!canSave()}>Next</PrimaryButton>
          </div>
        </>
      )}
    </>
  );
}
