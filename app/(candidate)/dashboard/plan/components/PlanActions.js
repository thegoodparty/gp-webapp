import React from 'react';
import AiModal from './AiModal';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { FaSave } from 'react-icons/fa';

function PlanActions({ handleSave, handleRegenerate, isEdited }) {
  return (
    <div className="flex items-center justify-center mt-6 py-6 hidden-for-print">
      <AiModal submitCallback={handleRegenerate} showWarning={isEdited} />
      <div onClick={handleSave}>
        <PrimaryButton>
          <div className="flex items-center">
            <FaSave className="mr-2" /> Save
          </div>
        </PrimaryButton>
      </div>
    </div>
  );
}

export default PlanActions;
