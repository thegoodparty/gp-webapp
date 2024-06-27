'use client';
import { useEffect, useState } from 'react';
import LoadingAI from './LoadingAI';
import CircularProgress from '@mui/material/CircularProgress';

import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import PlanVersion from './PlanVersion';
import TogglePanel from '@shared/utils/TogglePanel';
import PlanDisplay from './PlanDisplay';
import PlanActions from './PlanActions';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Link from 'next/link';
import { flows } from '../../questions/components/QuestionsPage';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';

async function generateAI(key, regenerate, chat, editMode) {
  try {
    const api = gpApi.campaign?.ai.create;
    return await gpFetch(api, {
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

function canGenerate(campaign, key, candidatePositions) {
  const questions = flows[key];
  if (!campaign?.details) {
    return false;
  }
  const { customIssues } = campaign?.details;

  const issuesCount =
    (customIssues?.length || 0) + candidatePositions?.length || 0;
  const { occupation, funFact, pastExperience, website, runningAgainst } =
    campaign?.details || {};
  /*
'occupation',
    'funFact',
    'pastExperience',
    'issues',
    'runningAgainst',
    'website',
  */
  let answeredQuestions = 0;
  questions.forEach((question) => {
    if (question === 'occupation' && occupation) {
      answeredQuestions++;
    }
    if (question === 'funFact' && funFact) {
      answeredQuestions++;
    }
    if (question === 'pastExperience' && pastExperience) {
      answeredQuestions++;
    }
    if (question === 'issues' && issuesCount >= 3) {
      answeredQuestions++;
    }
    if (question === 'runningAgainst' && runningAgainst) {
      answeredQuestions++;
    }
    if (question === 'website' && website) {
      answeredQuestions++;
    }
  });
  return answeredQuestions >= questions.length;
}

export default function CampaignPlanSection({
  section,
  campaign,
  versions = {},
  updateVersionsCallback,
  candidatePositions,
  expandSection,
}) {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [plan, setPlan] = useState(false);
  const [canGenerateAi, setCanGenerateAi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyped, setIsTyped] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const aiContent = campaign?.aiContent;
  const { key } = section;

  useEffect(() => {
    if (aiContent && aiContent[key]) {
      setPlan(aiContent[key]);
      setLoading(false);
      setIsTyped(true);
    }
  }, [aiContent]);

  // useEffect(() => {
  //   if (expandSection) {
  //     handleOpen(false);
  //   }
  // }, [expandSection]);

  useEffect(() => {
    const can = canGenerate(campaign, key, candidatePositions);
    setCanGenerateAi(can);
  }, [campaign, key]);

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

  const setEdit = () => {
    setIsEdited(true);
    setEditMode(true);
  };

  const handleEdit = async (editedPlan) => {
    const updated = {
      ...plan,
      content: editedPlan,
    };
    setPlan(updated);
  };

  const handleRegenerate = async (improveQuery) => {
    setLoading(true);
    let chat = [];
    if (improveQuery !== '') {
      chat = [
        { role: 'system', content: plan.content },
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
    if (!updated.aiContent) {
      updated.aiContent = {};
    }

    updated.aiContent[key] = plan;
    setIsEdited(false);
    setEditMode(false);

    await updateCampaign([{ key: `aiContent.${key}`, value: plan }]);
    await updateVersionsCallback();
  };

  const updatePlanCallback = (version) => {
    setPlan(version);
    setIsEdited(true);
  };

  const handleOpen = (isOpen) => {
    if (isOpen && !loading && !plan && canGenerateAi) {
      handleRegenerate('');
    }
  };

  return (
    <section
      key={section.key}
      id={`plan-section-${section.key}`}
      className="my-3"
    >
      <TogglePanel
        label={section.title}
        icon={loading ? <CircularProgress size={20} /> : section.icon}
        openCallback={handleOpen}
        forceExpand={expandSection}
      >
        <div className={`section-content-${section.key}`}>
          {loading ? (
            <LoadingAI />
          ) : (
            <div className="border border-slate-500 bg-indigo-50 rounded-xl">
              {plan ? (
                <>
                  <PlanVersion
                    campaign={campaign}
                    versions={versions ? versions[key] : {}}
                    updatePlanCallback={updatePlanCallback}
                    latestVersion={aiContent ? aiContent[key] : false}
                  />
                  <PlanDisplay
                    plan={plan}
                    isTyped={isTyped}
                    setIsTyped={setIsTyped}
                    setEdit={setEdit}
                    isFailed={isFailed}
                    handleEdit={handleEdit}
                    editMode={editMode}
                  />

                  <PlanActions
                    isEdited={isEdited}
                    handleSave={handleSave}
                    handleRegenerate={handleRegenerate}
                  />
                </>
              ) : (
                <>
                  {canGenerateAi ? (
                    <div className="py-12 flex justify-center">
                      <div
                        onClick={() => {
                          handleRegenerate('');
                        }}
                      >
                        <PrimaryButton>Generate {section.title}</PrimaryButton>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 flex justify-center">
                      <Link href={`/dashboard/questions?generate=${key}`}>
                        <PrimaryButton>
                          Answer additional questions
                        </PrimaryButton>
                      </Link>
                    </div>
                  )}
                </>
              )}
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
