'use client';
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
}) {
  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState(text);

  const handleEditMode = () => {
    setEdit(!edit);
  };

  const handleEdit = async (edited) => {
    setContent(edited);
    setEdit(false);
    if (isStaged && campaign && section && sectionKey) {
      await updateCampaign({
        ...campaign,
        [section]: {
          ...campaign[section],
          [sectionKey]: edited,
        },
      });
    }
  };

  return (
    <div>
      {edit ? (
        <div>
          <RichEditor initialText={content} onChangeCallback={handleEdit} />
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
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </>
      )}
    </div>
  );
}
