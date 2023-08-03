'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import PlanVersion from './PlanVersion';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import styles from './ContentEditor.module.scss';
import LoadingAI from 'app/(candidate)/onboarding/[slug]/campaign-plan/components/LoadingAI';
import BlackButton from '@shared/buttons/BlackButton';
import AiModal from 'app/(candidate)/onboarding/[slug]/campaign-plan/components/AiModal';
import Typewriter from 'typewriter-effect';
import { FaPencilAlt, FaSave } from 'react-icons/fa';

import SecondaryButton from '@shared/buttons/SecondaryButton';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { IoIosArrowDown } from 'react-icons/io';
import { BsThreeDots } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa';

const RichEditor = dynamic(
  () =>
    import(
      'app/(candidate)/onboarding/[slug]/campaign-plan/components/RichEditor'
    ),
  {
    loading: () => (
      <p className="p-4 text-center text-2xl font-bold">Loading Editor...</p>
    ),
  },
);

let aiCount = 0;
let aiTotalCount = 0;

export default function ContentEditor({
  section = '',
  campaign,
  initialOpen,
  versions = {},
  updateVersionsCallback,
  forceExpand,
  subSectionKey = 'aiContent',
}) {
  const [open, setOpen] = useState(initialOpen);
  const [editMode, setEditMode] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [plan, setPlan] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTyped, setIsTyped] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const campaignPlan = campaign[subSectionKey];
  const key = section.toLowerCase();

  useEffect(() => {
    console.log('key', key);
    console.log('campaignPlan', campaignPlan);
    console.log('campaignPlan[key]', campaignPlan[key]);
    if (campaignPlan && campaignPlan[key]) {
      console.log('AI Found. Loading...');
      setPlan(campaignPlan[key].content);
      setLoading(false);
      setIsTyped(true);
    }
  }, [campaignPlan]);

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
    let existing_name;
    if (!updated[subSectionKey]) {
      updated[subSectionKey] = {};
    } else if (updated[subSectionKey][key]) {
      existing_name = updated[subSectionKey][key].name;
    }

    let now = new Date();
    let updatedAt = now.toISOString().split('T')[0];
    updated[subSectionKey][key] = {
      name: existing_name ? existing_name : key,
      updatedAt: updatedAt,
      content: plan,
    };

    // updated[subSectionKey][key] = plan;
    setIsEdited(false);
    setEditMode(false);
    await updateCampaign(updated, key);
    await updateVersionsCallback();
    // router.push(`/onboarding/${campaign.slug}/dashboard/1`);
  };

  const updatePlanCallback = (version) => {
    console.log('version', version);
    setPlan(version.content);
    setIsEdited(true);
  };

  const expand = open || forceExpand;

  return (
    <div>
      <div className="flex w-full h-full p-5 items-center justify-items-center bg-slate-50">
        <div className="flex justify-start">
          {/* desktop back button */}
          <div className="hidden md:block">
            <SecondaryButton size="medium">
              <div className="flex items-center whitespace-nowrap p-1">
                <MdOutlineArrowBackIos className="text-sm" />
                &nbsp; Back
              </div>
            </SecondaryButton>
          </div>

          {/* mobile back button */}
          <div className="md:hidden">
            <SecondaryButton size="small">
              <div className="flex items-center whitespace-nowrap p-1">
                <MdOutlineArrowBackIos className="text-sm" />
                &nbsp;
              </div>
            </SecondaryButton>
          </div>

          {/* desktop new document button */}
          <div className="ml-5 hidden md:block">
            <SecondaryButton size="medium" variant="text">
              <div className="flex items-center whitespace-nowrap p-1">
                <FaPlus className="text-sm" />
                &nbsp; New document
              </div>
            </SecondaryButton>
          </div>

          {/* mobile new document button */}
          <div className="ml-3 md:hidden">
            <SecondaryButton size="small" variant="text">
              <div className="flex items-center whitespace-nowrap p-1">
                <FaPlus className="text-sm" />
                &nbsp;
              </div>
            </SecondaryButton>
          </div>

          <div className="ml-3">
            <div className="text-indigo-100 p-1 md:mt-2">Saved</div>
          </div>
        </div>

        <div className="flex w-full justify-end">
          {/* version button */}
          <PlanVersion
            campaign={campaign}
            versions={versions ? versions[key] : {}}
            updatePlanCallback={updatePlanCallback}
            latestVersion={campaignPlan ? campaignPlan[key] : false}
          />

          {/* mobile three dots button */}
          <div className="ml-3 md:hidden">
            <SecondaryButton size="small">
              <div className="flex items-center whitespace-nowrap p-1">
                <BsThreeDots className="text-sm" />
                &nbsp;
              </div>
            </SecondaryButton>
          </div>

          {/* desktop three dots button */}
          <div className="ml-5 hidden md:block">
            <SecondaryButton size="medium">
              <div className="flex items-center whitespace-nowrap p-1">
                <BsThreeDots className="text-sm" />
                &nbsp;
              </div>
            </SecondaryButton>
          </div>
        </div>
      </div>

      <div className="flex w-full h-screen justify-items-center justify-center">
        <div className="max-w-3xl w-full h-full p-10 font-sfpro">
          <section key={section.key} className="my-3">
            <div className="">
              {loading ? (
                <LoadingAI />
              ) : (
                <div className="border-0">
                  {/* <div className={`p-3 ${styles.root}`}> */}
                  <div className={`p-3`}>
                    {isFailed ? (
                      <div className="text-center text-xl">
                        Failed to generate plan click here to try again
                        <div className="mt-4 text-base font-black">
                          <a
                            href={`/onboarding/${campaign.slug}/campaign-plan`}
                          >
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
                            // sx={{'jd-color-border': '#ffffff'}}
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
          </section>
        </div>
      </div>
    </div>
  );
}
