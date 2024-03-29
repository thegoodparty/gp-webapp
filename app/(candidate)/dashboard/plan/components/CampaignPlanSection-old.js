'use client';
import { useEffect, useState } from 'react';
import { FaPencilAlt, FaSave } from 'react-icons/fa';
import styles from './CampaignPlan.module.scss';
import LoadingAI from './LoadingAI';
import CircularProgress from '@mui/material/CircularProgress';
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
import TogglePanel from '@shared/utils/TogglePanel';
import PrimaryButton from '@shared/buttons/PrimaryButton';
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
  versions = {},
  updateVersionsCallback,
  forceExpand,
  subSectionKey = 'campaignPlan',
}) {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [plan, setPlan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyped, setIsTyped] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const campaignPlan = campaign[subSectionKey];
  const { key } = section;

  // useEffect(() => {
  //   if (!campaignPlan || !campaignPlan[key]) {
  //     createInitialAI();
  //   } else {
  //     setPlan(campaignPlan[key]);
  //     setLoading(false);
  //     setIsTyped(true);
  //   }
  // }, [campaignPlan]);

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
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saving...',
        isError: false,
      };
    });

    const updated = campaign;
    if (!updated[subSectionKey]) {
      updated[subSectionKey] = {};
    }

    updated[subSectionKey][key] = plan;
    setIsEdited(false);
    setEditMode(false);
    await updateCampaign(updated, key, false, subSectionKey);
    await updateVersionsCallback();
    // router.push(`/onboarding/${campaign.slug}/dashboard/1`);
  };

  const updatePlanCallback = (version) => {
    setPlan(version);
    setIsEdited(true);
  };

  const expand = open || forceExpand;

  return (
    <section key={section.key} className="my-3">
      <TogglePanel
        label={section.title}
        icon={loading ? <CircularProgress size={20} /> : section.icon}
        forceExpand={forceExpand}
      >
        <div className="">
          {loading ? (
            <LoadingAI />
          ) : (section.key === 'pathToVictory' ||
              section.key === 'mobilizing') &&
            campaign?.pathToVictory === undefined ? (
            <div className="text-center text-xl">
              Our team is working on your campaign materials now. This can take
              up to 48 hours. In the meantime, create some content in the AI
              Campaign Content section.
            </div>
          ) : (
            <div className="border border-slate-500 bg-slate-50 rounded-xl">
              <PlanVersion
                campaign={campaign}
                versions={versions ? versions[key] : {}}
                updatePlanCallback={updatePlanCallback}
                latestVersion={campaignPlan ? campaignPlan[key] : false}
              />
              <div className={`p-3 lg:p-6 my-6 rounded-xl ${styles.plan}`}>
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
                        <div className="absolute bottom-2 right-2 rounded-full w-10 h-10 flex items-center justify-center bg-slate-500 cursor-pointer hidden-for-print">
                          <FaPencilAlt />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center justify-center mt-6 py-6 hidden-for-print">
                <AiModal
                  submitCallback={handleRegenerate}
                  showWarning={isEdited}
                />
                <div onClick={handleSave}>
                  <PrimaryButton>
                    <div className="flex items-center">
                      <FaSave className="mr-2" /> Save
                    </div>
                  </PrimaryButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </TogglePanel>
    </section>
  );
}

/*
{"slug":"tomer-almog","lastVisited":1706588129827,"id":1,"currentStep":5,"goals":{},"details":{"phone":"3109759102","runForOffice":"yes","campaignCommittee":"committee of Javascript","noCommittee":false,"party":"Independent","otherParty":"","zip":"93065","office":"Other","positionId":"Z2lkOi8vYmFsbG90LWZhY3RvcnkvUG9zaXRpb24vNDYxNTQ=","electionId":"Z2lkOi8vYmFsbG90LWZhY3RvcnkvRWxlY3Rpb24vNDMxNw==","state":"CA","otherOffice":"U.S. Senate - California","officeTermLength":"2 years","district":"","city":"","ballotOffice":null,"pledged":true},"lastStepDate":"2024-01-17","launchStatus":"launched","candidateSlug":"tomer-almog","p2vStatus":"Waiting"}
*/
