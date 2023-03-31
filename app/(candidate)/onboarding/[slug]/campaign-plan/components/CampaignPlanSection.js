'use client';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import useAiPlan from './useAiPlan';
import styles from './CampaignPlan.module.scss';
import LoadingAI from './LoadingAI';
import { CircularProgress } from '@mui/material';
import BlackButton from '@shared/buttons/BlackButton';
import dynamic from 'next/dynamic';
const RichEditor = dynamic(() => import('./RichEditor'), {
  loading: () => (
    <p className="p-4 text-center text-2xl font-bold">Loading Editor...</p>
  ),
});

export default function CampaignPlanSection({
  section,
  campaign,
  initialOpen,
}) {
  const [open, setOpen] = useState(initialOpen);
  const [editMode, setEditMode] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  const { plan, loading, isFailed, isTyped } = useAiPlan(
    campaign,
    'campaignPlan',
    section.key,
  );

  const toggleSelect = () => {
    setOpen(!open);
  };
  return (
    <section key={section.key} className="my-3 rounded-2xl bg-white">
      <div
        className="flex justify-between items-center p-6 cursor-pointer"
        onClick={() => toggleSelect()}
      >
        <h3 className="font-bold text-2xl flex items-center">
          <span className="inline-block mr-6">{section.title}</span>
          {loading && <CircularProgress size={20} />}
        </h3>
        <div className={`transition-all duration-300 ${open && 'rotate-180'}`}>
          <FaChevronDown size={24} />
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300  ${
          open ? 'max-h-[2000px]' : 'max-h-0 '
        }`}
      >
        <div className="p-6 ">
          {loading ? (
            <LoadingAI />
          ) : (
            <div className="border-t border-2 mb-10 border-slate-100">
              <div className={`bg-white p-6 my-6 rounded-xl ${styles.plan}`}>
                {isFailed ? (
                  <div className="text-center text-xl">
                    Failed to generate plan click here to try again
                    <div className="mt-4 text-base font-black">
                      <a href={`/onboarding/${campaign.slug}/campaign-plan`}>
                        <BlackButton>Regenerate</BlackButton>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: plan }} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
