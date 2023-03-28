'use client';
import Pill from '@shared/buttons/Pill';
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
import LoadingAI from './LoadingAI';
import { getCookie, setCookie } from 'helpers/cookieHelper';

const RichEditor = dynamic(() => import('./RichEditor'), {
  loading: () => (
    <p className="p-4 text-center text-2xl font-bold">Loading Editor...</p>
  ),
});

async function generateAI(subSectionKey, key, regenerate, chat, editMode) {
  try {
    const api = gpApi.campaign.onboarding.ai.create;
    return await gpFetch(api, {
      subSectionKey,
      key,
      regenerate,
      chat,
      editMode,
    });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

let aiCount = 0;
let aiTotalCount = 0;
const typedCookie = 'plan-typed';

export default function CampaignPlan({ campaign }) {
  const subSectionKey = 'campaignPlan';
  const key = 'plan';
  const [plan, setPlan] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  let isTypedCookie = getCookie(typedCookie);
  const [isTyped, setIsTyped] = useState(isTypedCookie === 'yes');

  const { campaignPlan } = campaign;
  useEffect(() => {
    if (!campaignPlan || !campaignPlan.plan) {
      createInitialAI();
    } else {
      setPlan(campaignPlan.plan);
      setLoading(false);
      setIsTyped(true);
    }
  }, [campaignPlan]);

  const createInitialAI = async (regenerate, chat, editMode) => {
    aiCount++;
    aiTotalCount++;
    if (aiTotalCount >= 100) {
      //fail
      setPlan(
        'Failed to generate a campaign plan. Please contact us for help.',
      );
      setLoading(false);
      return;
    }
    const { chatResponse, status } = await generateAI(
      subSectionKey,
      key,
      regenerate,
      chat,
      editMode,
    );
    if (!chatResponse && status === 'processing') {
      if (aiCount < 20) {
        setTimeout(async () => {
          await createInitialAI();
        }, 5000);
      } else {
        //something went wrong, we are stuck in a loop. reCreate the response
        console.log('regenerating');
        aiCount = 0;
        createInitialAI(true);
      }
    } else {
      aiCount = 0;
      setPlan(chatResponse);
      setLoading(false);
      setCookie(typedCookie, 'yes');
    }
  };

  const handleSubmit = async (improveQuery) => {
    setCookie(typedCookie, 'no');

    setLoading(true);
    const chat = [
      // { role: 'assistant', content: plan },
      { role: 'user', content: improveQuery },
    ];
    setPlan(false);
    aiCount = 0;
    aiTotalCount = 0;
    setIsTyped(false);
    await createInitialAI(true, chat, true);
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
        <LoadingAI />
      ) : (
        <div className={`bg-white p-6 my-6 rounded-xl ${styles.plan}`}>
          {editMode ? (
            <RichEditor initialText={plan} onChangeCallback={handleEdit} />
          ) : (
            <div className="relative pb-10 cursor-text" onClick={setEdit}>
              {isTyped ? (
                <div dangerouslySetInnerHTML={{ __html: plan }} />
              ) : (
                <Typewriter
                  options={{
                    delay: 1,
                  }}
                  onInit={(typewriter) => {
                    typewriter
                      .typeString(plan)
                      .callFunction(() => {
                        setIsTyped(true);
                        setCookie(typedCookie, 'yes');
                      })

                      .start();
                  }}
                />
              )}
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
