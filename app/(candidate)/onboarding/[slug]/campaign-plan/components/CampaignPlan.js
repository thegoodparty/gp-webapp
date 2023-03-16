'use client';
import Pill from '@shared/buttons/Pill';
import LoadingAnimation from '@shared/utils/LoadingAnimation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useEffect, useState } from 'react';
import styles from './CampaignPlan.module.scss';
import { FaSave, FaPencilAlt } from 'react-icons/fa';
import AiModal from './AiModal';
import Typewriter from 'typewriter-effect';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const RichEditor = dynamic(() => import('./RichEditor'), {
  loading: () => (
    <p className="p-4 text-center text-2xl font-bold">Loading Editor...</p>
  ),
});

async function generateAI(subSectionKey, key) {
  try {
    const api = gpApi.campaign.onboarding.ai.create;
    return await gpFetch(api, { subSectionKey, key });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

async function regenerateAI(subSectionKey, key, prompt) {
  try {
    const api = gpApi.campaign.onboarding.ai.edit;
    return await gpFetch(api, { subSectionKey, key, chat: prompt });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function CampaignPlan({ campaign }) {
  const subSectionKey = 'campaignPlan';
  const key = 'plan';
  const [plan, setPlan] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { campaignPlan } = campaign;
  useEffect(() => {
    if (!campaignPlan || !campaignPlan.plan) {
      createInitialAI();
    } else {
      setPlan(campaignPlan.plan);
      setLoading(false);
    }
  }, [campaignPlan]);

  const createInitialAI = async () => {
    const { chatResponse } = await generateAI(subSectionKey, key);
    setPlan(chatResponse);
    setLoading(false);
  };

  const handleSubmit = async (improveQuery) => {
    console.log('handling submit', improveQuery);
    setLoading(true);
    const chat = [
      { role: 'assistant', content: plan },
      { role: 'user', content: improveQuery },
    ];
    setPlan(false);
    const { chatResponse } = await regenerateAI(subSectionKey, key, chat);
    setPlan(chatResponse);
    setLoading(false);
  };

  const setEdit = () => {
    setIsEdited(true);
    setEditMode(true);
  };

  const handleEdit = async (editedPlan) => {
    setPlan(editedPlan);
  };

  const handleSave = async () => {
    const updated = campaign;
    if (!updated[subSectionKey]) {
      updated[subSectionKey] = {};
    }

    updated[subSectionKey][key] = plan;
    await updateCampaign(updated);
    router.push(`/onboarding/${campaign.slug}/dashboard/1`);
  };

  return (
    <>
      {loading ? (
        <LoadingAnimation label="Generating your campaign plan with Good Party AI" />
      ) : (
        <div className={`bg-white p-6 my-6 rounded-xl ${styles.plan}`}>
          {editMode ? (
            <RichEditor initialText={plan} onChangeCallback={handleEdit} />
          ) : (
            <div className="relative pb-10 cursor-text" onClick={setEdit}>
              <Typewriter
                options={{
                  delay: 1,
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString(plan)
                    // .callFunction(() => {
                    //   onChangeField('showButtons', true);
                    // })

                    .start();
                }}
              />
              <div className="absolute bottom-2 right-2 rounded-full w-10 h-10 flex items-center justify-center bg-slate-100 cursor-pointer ">
                <FaPencilAlt />
              </div>
            </div>
          )}
          <div className="flex items-center justify-center mt-6 border-t border-t-slate-300  pt-6">
            <AiModal submitCallback={handleSubmit} showWarning={isEdited} />
            <div onClick={handleSave}>
              <Pill>
                <div className="flex items-center">
                  <FaSave className="mr-2" /> Save and Continue
                </div>
              </Pill>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
