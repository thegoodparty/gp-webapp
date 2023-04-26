'use client';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaPencilAlt, FaSave } from 'react-icons/fa';
import styles from './CampaignPlan.module.scss';
import LoadingAI from './LoadingAI';
import { CircularProgress } from '@mui/material';
import BlackButton from '@shared/buttons/BlackButton';
import dynamic from 'next/dynamic';
import AiModal from './AiModal';
import Pill from '@shared/buttons/Pill';
import Typewriter from 'typewriter-effect';

import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import PlanVersion from './PlanVersion';
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

export default function CampaignPlanSection({
  section,
  campaign,
  initialOpen,
  versions,
}) {
  const [open, setOpen] = useState(initialOpen);
  const [editMode, setEditMode] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [plan, setPlan] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTyped, setIsTyped] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const { campaignPlan } = campaign;
  const { key } = section;
  const subSectionKey = 'campaignPlan';

  useEffect(() => {
    if (!campaignPlan || !campaignPlan[key]) {
      createInitialAI();
    } else {
      setPlan(campaignPlan[key]);
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
      setIsFailed(true);
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
      if (aiCount < 40) {
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
    }
  };

  // const { plan, loading, isFailed, isTyped } = useAiPlan(
  //   campaign,
  //   'campaignPlan',
  //   section.key,
  // );

  const toggleSelect = () => {
    setOpen(!open);
  };

  const setEdit = () => {
    setIsEdited(true);
    setEditMode(true);
  };

  const handleEdit = async (editedPlan) => {
    setPlan(editedPlan);
  };

  const handleRegenerate = async (improveQuery) => {
    setLoading(true);
    let chat = [];
    if (improveQuery !== '') {
      chat = [
        { role: 'system', content: plan },
        { role: 'user', content: improveQuery },
      ];
    }
    setPlan(false);
    aiCount = 0;
    aiTotalCount = 0;
    setIsTyped(false);
    await createInitialAI(true, chat, true);
  };

  const handleSave = async () => {
    const updated = campaign;
    if (!updated[subSectionKey]) {
      updated[subSectionKey] = {};
    }

    updated[subSectionKey][key] = plan;
    setIsEdited(false);
    setEditMode(false);
    await updateCampaign(updated, key);
    // router.push(`/onboarding/${campaign.slug}/dashboard/1`);
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saving...',
        isError: false,
      };
    });
  };

  const updatePlanCallback = (version) => {
    setPlan(version);
    setIsEdited(true);
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
          open ? 'max-h-[3000px]' : 'max-h-0 '
        }`}
      >
        <div className="p-6 ">
          {loading ? (
            <LoadingAI />
          ) : (
            <div className="border-t border-2 mb-10 border-slate-100">
              <PlanVersion
                campaign={campaign}
                versions={versions[key]}
                updatePlanCallback={updatePlanCallback}
                latestVersion={campaignPlan[key]}
              />
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
                  <>
                    {editMode ? (
                      <RichEditor
                        initialText={plan}
                        onChangeCallback={handleEdit}
                      />
                    ) : (
                      <div
                        className="relative pb-10 cursor-text"
                        onClick={setEdit}
                      >
                        {initialOpen && !isTyped ? (
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
                        <div className="absolute bottom-2 right-2 rounded-full w-10 h-10 flex items-center justify-center bg-slate-100 cursor-pointer ">
                          <FaPencilAlt />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center justify-center mt-6 border-t border-t-slate-300 py-6">
                <AiModal
                  submitCallback={handleRegenerate}
                  showWarning={isEdited}
                />
                <div onClick={handleSave}>
                  <Pill>
                    <div className="flex items-center">
                      <FaSave className="mr-2" /> Save
                    </div>
                  </Pill>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
