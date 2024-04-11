import React from 'react';
import Typewriter from 'typewriter-effect';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { FaPencilAlt } from 'react-icons/fa';
import styles from './CampaignPlan.module.scss';

import dynamic from 'next/dynamic';
const RichEditor = dynamic(() => import('./RichEditor'), {
  loading: () => (
    <p className="p-4 text-center text-2xl font-bold">Loading Editor...</p>
  ),
});

export default function PlanDisplay({
  plan,
  isTyped,
  setIsTyped,
  setEdit,
  isFailed,
  handleEdit,
  editMode,
}) {
  return (
    <div className={`p-3 lg:p-6 my-6 rounded-xl ${styles.plan}`}>
      {isFailed ? (
        <div className="text-center text-xl">
          Failed to generate plan click here to try again
          <div className="mt-4 text-base font-black">
            <a href={`/onboarding/${campaign.slug}/campaign-plan`}>
              <PrimaryButton>Regenerate</PrimaryButton>
            </a>
          </div>
        </div>
      ) : (
        <>
          {editMode ? (
            <RichEditor initialText={plan} onChangeCallback={handleEdit} />
          ) : (
            <div className="relative pb-10 cursor-text" onClick={setEdit}>
              {!isTyped ? (
                <Typewriter
                  options={{
                    delay: 1,
                  }}
                  onInit={(typewriter) => {
                    typewriter
                      .typeString(plan)
                      .callFunction(() => {
                        setIsTyped(true);
                      })

                      .start();
                  }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: plan }} />
              )}
              <div className="absolute bottom-2 right-2 rounded-full w-10 h-10 flex items-center justify-center bg-indigo-500 cursor-pointer hidden-for-print">
                <FaPencilAlt />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
