'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import PlanVersion from './PlanVersion';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import LoadingContent from './LoadingContent';
import BlackButton from '@shared/buttons/BlackButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { FaGlobe } from 'react-icons/fa';
import Link from 'next/link';
import Actions from '../../components/Actions';
import { debounce } from '/helpers/debounceHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { LuClipboard } from 'react-icons/lu';
import CopyToClipboard from '@shared/utils/CopyToClipboard';
import InputFieldsModal from '../../components/InputFieldsModal';
import { fetchInputFields } from '../../components/NewContentFlow';

const RichEditor = dynamic(() => import('app/shared/utils/RichEditor'), {
  loading: () => (
    <p className="p-4 text-center text-2xl font-bold">Loading Editor...</p>
  ),
});

let aiCount = 0;
let aiTotalCount = 0;

export default function ContentEditor({
  section = '',
  campaign,
  versions = {},
  updateVersionsCallback,
  subSectionKey = 'aiContent',
}) {
  const [plan, setPlan] = useState(false);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [documentName, setDocumentName] = useState('Untitled Document');
  const [saved, setSaved] = useState('Saved');
  const [inputFields, setInputFields] = useState([]);
  const [initialInputValues, setInitialInputValues] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);

  const campaignPlan = campaign[subSectionKey];
  const key = section;

  useEffect(() => {
    if (campaignPlan && campaignPlan[key]) {
      setPlan(campaignPlan[key].content);
      setDocumentName(campaignPlan[key].name);
      setLoading(false);
      setRegenerating(false);
      loadInputFields();
      loadInputValues();
    }
  }, [campaignPlan]);

  const loadInputFields = async () => {
    const keyNoDigits = key.replace(/\d+$/, '');
    const { content } = await fetchInputFields(keyNoDigits);
    if (content) {
      setInputFields(content);
    } else {
      setInputFields([]);
    }
  };

  const loadInputValues = async () => {
    if (campaignPlan[key]?.inputValues) {
      setInitialInputValues(campaignPlan[key].inputValues);
    }
  };

  const handleEdit = async (editedPlan, debounceTime = 5000) => {
    setPlan(editedPlan);
    // add this back to turn autoSave back on.
    if (campaignPlan[key].content != plan) {
      debounce(handleTypingComplete, undefined, debounceTime);
    }
  };

  // Function to be called when the user has finished typing
  const handleTypingComplete = async () => {
    await handleSave();
  };

  const handleSave = async () => {
    setSaved('Saving...');

    const updated = campaign;
    let existingName;
    let existingInputs = {};
    if (!updated[subSectionKey]) {
      updated[subSectionKey] = {};
    } else if (updated[subSectionKey][key]) {
      existingName = updated[subSectionKey][key].name;
      existingInputs = updated[subSectionKey][key].inputValues;
      console.log('existingInputs', existingInputs);
    }

    let now = new Date();
    let updatedAt = now.toISOString().split('T')[0];
    updated[subSectionKey][key] = {
      name: existingName ? existingName : key,
      updatedAt: updatedAt,
      inputValues: existingInputs,
      content: plan,
    };

    // updated[subSectionKey][key] = plan;
    await updateCampaign(updated, key, false, 'aiContent');
    // await updateVersionsCallback();
    setSaved('Saved');
    // router.push(`/onboarding/${campaign.slug}/dashboard/1`);
  };

  const updatePlanCallback = (version) => {
    setPlan(version.text);
    setInitialInputValues(version.inputValues);
  };

  async function generateAI(
    subSectionKey,
    key,
    regenerate,
    chat,
    editMode,
    inputValues = {},
  ) {
    try {
      const api = gpApi.campaign.onboarding.ai.create;
      return await gpFetch(api, {
        subSectionKey,
        key,
        regenerate,
        chat,
        editMode,
        inputValues,
      });
    } catch (e) {
      console.log('error', e);
      return false;
    }
  }

  const createInitialAI = async (
    regenerate,
    chat,
    editMode,
    inputValues = {},
  ) => {
    aiCount++;
    aiTotalCount++;
    if (aiTotalCount >= 100) {
      //fail
      setPlan(
        'Failed to generate a campaign plan. Please contact us for help.',
      );
      setLoading(false);
      setRegenerating(false);
      setIsFailed(true);
      return;
    }

    const { chatResponse, status } = await generateAI(
      subSectionKey,
      key,
      regenerate,
      chat,
      editMode,
      inputValues,
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
      console.log('chatResponse', chatResponse);
      aiCount = 0;
      if (status === 'completed') {
        setPlan(chatResponse.content);
        await updateVersionsCallback();
        setLoading(false);
        setRegenerating(false);
        setSaved('Saved');
      }
    }
  };

  const handleAdditionalInput = async (additionalPrompt, inputValues) => {
    setLoading(true);
    setInitialInputValues(inputValues);
    const chat = [
      // the re-generate does not need the context of the old plan.
      // { role: 'system', content: plan },
      { role: 'user', content: additionalPrompt },
    ];
    await createInitialAI(true, chat, true, inputValues);

    setShowModal(false);
  };

  const handleTranslate = async (language) => {
    setLoading(true);
    setInitialInputValues([]);
    const chat = [
      { role: 'system', content: plan },
      {
        role: 'user',
        content: 'Please translate the above text to: ' + language,
      },
    ];
    await createInitialAI(true, chat, true, [{ language: language }]);

    setShowModal(false);
  };

  return (
    <div>
      <div className="flex w-full h-auto p-5 items-center justify-items-center bg-slate-50">
        <div className="flex justify-start">
          {/* desktop back button */}
          <Link href="/dashboard/content">
            <div className="hidden md:block">
              <SecondaryButton size="medium">
                <div className="flex items-center whitespace-nowrap p-1">
                  <MdOutlineArrowBackIos className="text-sm" />
                  &nbsp; Back
                </div>
              </SecondaryButton>
            </div>
          </Link>

          {/* mobile back button */}
          <Link href="/dashboard/content">
            <div className="md:hidden">
              <SecondaryButton size="medium">
                <div className="flex items-center whitespace-nowrap p-1">
                  <MdOutlineArrowBackIos className="text-sm" />
                  &nbsp;
                </div>
              </SecondaryButton>
            </div>
          </Link>

          {/* desktop new document name. (not shown on mobile) */}
          <div className="ml-5 hidden md:block whitespace-nowrap">
            <div className="text-indigo-800 p-1 md:mt-2">{documentName}</div>
          </div>

          <div className="ml-1 mr-1">
            <div
              className={`p-1 mt-2 ${
                saved === 'Saving...' ? 'text-primary' : 'text-indigo-100'
              }`}
            >
              {saved}
            </div>
          </div>
        </div>

        <div className="flex w-full justify-end items-center justify-items-center">
          {inputFields && (
            <div className="mr-3" onClick={() => setShowModal(true)}>
              <PrimaryButton size="medium">
                Change <span className="hidden md:inline-block">details</span>
              </PrimaryButton>
            </div>
          )}
          {/* copy button mobile */}
          <div className="md:hidden mr-3">
            <CopyToClipboard text={plan}>
              <PrimaryButton size="medium">
                <div className="flex items-center whitespace-nowrap px-1  h-6">
                  <LuClipboard className="text-sm" />
                  &nbsp;
                </div>
              </PrimaryButton>
            </CopyToClipboard>
          </div>
          {/* copy button desktop */}
          <div className="hidden md:block mr-3">
            <CopyToClipboard text={plan} usePadding={false}>
              <PrimaryButton
                size="medium"
                className="flex items-center whitespace-nowrap"
              >
                <div className="flex items-center whitespace-nowrap h-6">
                  <LuClipboard className="text-sm mr-1" />
                  <div>Copy</div>
                </div>
              </PrimaryButton>
            </CopyToClipboard>
          </div>

          {/* translate button desktop */}
          <div
            className="hidden md:block mr-3"
            onClick={() => {
              setShowTranslate(true);
            }}
          >
            <PrimaryButton
              size="medium"
              className="flex items-center whitespace-nowrap"
            >
              <div className="flex items-center whitespace-nowrap h-6">
                <FaGlobe className="text-sm mr-1" />
                <div>Translate</div>
              </div>
            </PrimaryButton>
          </div>

          {/* version button */}
          <PlanVersion
            campaign={campaign}
            versions={versions ? versions[key] : {}}
            updatePlanCallback={updatePlanCallback}
            latestVersion={
              campaignPlan
                ? {
                    text: campaignPlan[key].content,
                    inputValues: initialInputValues,
                  }
                : {
                    text: '',
                    inputValues: {},
                  }
            }
          />
          <Actions
            slug={key}
            setDocumentName={setDocumentName}
            documentKey={key}
            name={documentName}
            handleTranslateCallback={handleTranslate}
            showTranslate={showTranslate}
            setShowTranslate={setShowTranslate}
          />
        </div>
      </div>

      <div className="flex w-full h-auto justify-items-center justify-center">
        <div className="max-w-6xl w-full h-auto p-10 font-sfpro">
          <section key={section.key} className="my-3">
            <div className="">
              {loading ? (
                <LoadingContent
                  title="Your content is loading ..."
                  subtitle="Please wait"
                />
              ) : regenerating ? (
                <LoadingContent />
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
                        <RichEditor
                          initialText={plan}
                          onChangeCallback={handleEdit}
                          useOnChange
                          // sx={{'jd-color-border': '#ffffff'}}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      <InputFieldsModal
        onSelectCallback={handleAdditionalInput}
        closeModalCallback={() => setShowModal(false)}
        showModal={showModal}
        inputFields={inputFields}
        inputValues={initialInputValues}
      />
    </div>
  );
}
