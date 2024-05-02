'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { FaCirclePlus } from 'react-icons/fa6';

export default function AddCustomIssue(props) {
  const { selectIssueCallback, saveCallback, campaign, editIssuePosition } =
    props;
  const findExistingIndex = () => {
    const { customIssues } = campaign?.details || {};
    const index = customIssues.findIndex(
      (customIssue) =>
        customIssue.title === editIssuePosition?.title &&
        customIssue.position === editIssuePosition?.position,
    );
    index !== -1 && selectIssueCallback('custom');
    return index;
  };

  const [existingIndex] = useState(findExistingIndex());

  const [selectCustom, setSelectCustom] = useState(
    editIssuePosition ? 'custom' : false,
  );
  const [title, setTitle] = useState(
    editIssuePosition ? editIssuePosition.title : '',
  );
  const [position, setPosition] = useState(
    editIssuePosition ? editIssuePosition.position : '',
  );

  const handleSelectCustom = () => {
    setSelectCustom(true);
    selectIssueCallback('custom');
  };

  const handleAnotherIssue = () => {
    setSelectCustom(false);
    selectIssueCallback(editIssuePosition ? editIssuePosition : false);
  };

  const canSave = () => {
    return selectCustom && title !== '' && position !== '';
  };

  const handleSave = async () => {
    if (!canSave()) {
      return;
    }
    const customIssues = campaign.details.customIssues || [];

    if (existingIndex !== -1) {
      customIssues[existingIndex] = {
        title,
        position,
      };
    } else {
      customIssues.push({
        title,
        position,
      });
    }
    await updateCampaign([
      { key: 'details.customIssues', value: customIssues },
    ]);
    await saveCallback(customIssues);
  };
  console.log(`selectCustom =>`, selectCustom);
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
            <PrimaryButton disabled={!canSave()}>
              {editIssuePosition ? 'Save' : 'Next'}
            </PrimaryButton>
          </div>
        </>
      )}
    </>
  );
}
