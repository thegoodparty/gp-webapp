'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { FaCirclePlus } from 'react-icons/fa6';

export default function AddCustomIssue(props) {
  const { selectIssueCallback, saveCallback, campaign, order } = props;
  const findExisting = () => {
    let existingIssue;
    let index = -1;
    if (campaign.customIssues) {
      for (let i = 0; i < campaign.customIssues.length; i++) {
        if (campaign.customIssues[i].order === order) {
          existingIssue = campaign.customIssues[i];
          selectIssueCallback('custom');
          index = i;
          break;
        }
      }
      return { existingIssue, index };
    }
    return {};
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
    const updated = {
      ...campaign,
    };
    if (!campaign.customIssues) {
      updated.customIssues = [];
    }
    let { index } = findExisting();
    console.log('undex', index);
    if (index !== -1) {
      updated.customIssues[index] = {
        title,
        position,
        order,
      };
    } else {
      updated.customIssues.push({
        title,
        position,
        order,
      });
    }

    await updateCampaign(updated);
    await saveCallback(updated);
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
        className="p-4 rounded-lg mt-2 bg-slate-700 font-semibold flex items-center cursor-pointer"
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
