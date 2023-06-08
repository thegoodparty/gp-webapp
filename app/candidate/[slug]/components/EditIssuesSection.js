'use client';

import IssuesSelector from 'app/(candidate)/onboarding/[slug]/details/[step]/components/IssuesSelector';
import { useState, useEffect } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import IssuesSection from './IssuesSection';

export default function EditIssuesSection(props) {
  const { campaign, positions } = props;
  const [edit, setEdit] = useState(false);

  const handleEditMode = () => {
    setEdit(true);
  };

  const onSave = () => {
    window.location.reload();
  };

  console.log('positions', positions);

  return (
    <>
      {edit ? (
        <section className="bg-white  my-3 rounded-2xl p-6 ">
          <h3 className="font-bold mt-5 mb-3 text-xl">Edit Issues</h3>
          <IssuesSelector
            campaign={campaign}
            positions={positions}
            subSectionKey="details"
            onSaveCallback={onSave}
            buttonLabel="SAVE"
          />
        </section>
      ) : (
        <div className="relative">
          <div className="absolute z-20 right-2 top-2" onClick={handleEditMode}>
            <div className="h-12 w-12 inline-flex items-center justify-center bg-slate-50 rounded-full cursor-pointer">
              <FaPencilAlt />
            </div>
          </div>
          <IssuesSection {...props} />
        </div>
      )}
    </>
  );
}
