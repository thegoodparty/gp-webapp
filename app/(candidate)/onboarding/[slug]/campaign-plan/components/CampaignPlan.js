'use client';
import Pill from '@shared/buttons/Pill';
import LoadingAnimation from '@shared/utils/LoadingAnimation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useEffect, useState } from 'react';
import styles from './CampaignPlan.module.scss';
import { FaRedoAlt, FaEdit } from 'react-icons/fa';
import AiModal from './AiModal';
import Typewriter from 'typewriter-effect';

async function generateAI(subSectionKey, key) {
  try {
    const api = gpApi.campaign.onboarding.ai.create;
    return await gpFetch(api, { subSectionKey, key });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function CampaignPlan({ campaign }) {
  const [plan, setPlan] = useState(false);
  const [loading, setLoading] = useState(true);
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
    const { chatResponse } = await generateAI('campaignPlan', 'plan');
    setPlan(chatResponse);
    setLoading(false);
  };
  return (
    <>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div className={`bg-white p-6 my-6 rounded-xl ${styles.plan}`}>
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
          {/* <div dangerouslySetInnerHTML={{ __html: plan }} /> */}
          <div className="flex items-center justify-center mt-6 border-t border-t-slate-300 pt-6">
            <AiModal initialText={plan} />
          </div>
        </div>
      )}
    </>
  );
}
