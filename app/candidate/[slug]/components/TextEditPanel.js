'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import RichEditor from 'app/(candidate)/onboarding/[slug]/campaign-plan/components/RichEditor';
import { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';

export default function TextEditPanel({
  text,
  isStaged,
  section,
  sectionKey,
  campaign,
  candidate,
  saveCallback,
}) {
  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState(text);

  const handleEditMode = () => {
    setEdit(!edit);
  };

  const handleSave = async () => {
    setEdit(false);
    if (isStaged && campaign && section && sectionKey) {
      await updateCampaign({
        ...campaign,
        [section]: {
          ...campaign[section],
          [sectionKey]: edited,
        },
      });
    } else {
      await saveCallback({
        ...candidate,
        [sectionKey]: content,
      });
    }
  };

  return (
    <div>
      {edit ? (
        <div>
          <TextField
            label={sectionKey}
            fullWidth
            multiline
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
          {/* <RichEditor initialText={content} onChangeCallback={handleEdit} /> */}
          <div className="my-3" onClick={handleSave}>
            <PrimaryButton fullWidth>Save</PrimaryButton>
          </div>
        </div>
      ) : (
        <>
          <div className="relative text-right">
            <div
              className="text-base h-12 w-12 inline-flex items-center justify-center bg-slate-50 rounded-full cursor-pointer"
              onClick={handleEditMode}
            >
              <FaPencilAlt />
            </div>
          </div>
          <div
            className="break-words"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </>
      )}
    </div>
  );
}
