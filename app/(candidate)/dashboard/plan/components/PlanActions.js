import React from 'react';
import AiModal from './AiModal';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { FaSave } from 'react-icons/fa';
import { buildTrackingAttrs } from 'helpers/fullStoryHelper';

function PlanActions({ handleSave, handleRegenerate, isEdited, section }) {
  const trackingAttrs = buildTrackingAttrs('Edit AI Plan Save Button', {
    hasChanges: isEdited,
    section: section.title,
    key: section.key,
  });

  return (
    <div className="flex items-center justify-center mt-6 py-6 hidden-for-print">
      <AiModal
        section={section}
        submitCallback={handleRegenerate}
        showWarning={isEdited}
      />
      <div onClick={handleSave}>
        <PrimaryButton {...trackingAttrs}>
          <div className="flex items-center">
            <FaSave className="mr-2" /> Save
          </div>
        </PrimaryButton>
      </div>
    </div>
  );
}

export default PlanActions;
