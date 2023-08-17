'use client';
import { useEffect, useState, useRef } from 'react';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import PlanVersion from './PlanVersion';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import LoadingAI from 'app/(candidate)/onboarding/[slug]/campaign-plan/components/LoadingAI';
import BlackButton from '@shared/buttons/BlackButton';
import AiModal from 'app/(candidate)/onboarding/[slug]/campaign-plan/components/AiModal';
import { FaSave } from 'react-icons/fa';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import Link from 'next/link';
import Actions from '../../components/Actions';
import { debounce } from '/helpers/debounceHelper';
import JoditEditor from 'jodit-react';
// import Typewriter from 'typewriter-effect';
// import { useHookstate } from '@hookstate/core';
// import { globalSnackbarState } from '@shared/utils/Snackbar';

export default function ContentEditor({
  section = '',
  campaign,
  versions = {},
  updateVersionsCallback,
  subSectionKey = 'aiContent',
}) {
  const [loading, setLoading] = useState(true);
  const [isTyped, setIsTyped] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [documentName, setDocumentName] = useState('Untitled Document');
  const [saved, setSaved] = useState('');
  // const snackbarState = useHookstate(globalSnackbarState);

  const editor = useRef(null);
  const plan = useRef('');
  const key = section;

  useEffect(() => {
    if (campaign && campaign[subSectionKey][key]) {
      plan.current = campaign[subSectionKey][key].content;
      setDocumentName(campaign[subSectionKey][key].name);
      setSaved('Saved');
      setLoading(false);
      setIsTyped(true);
    }
  }, [campaign]);

  // Function to be called when the user has finished typing
  const handleTypingComplete = async () => {
    if (campaign[subSectionKey][key].content === plan.current) {
      // do not call save if the content has not changed from load.
      return;
    } else {
      await handleSave();
    }
  };

  const handleRegenerate = async (improveQuery) => {
    setLoading(true);
    let chat = [];
    if (improveQuery !== '') {
      chat = [
        { role: 'system', content: plan.current },
        { role: 'user', content: improveQuery },
      ];
    }
    plan.current = '';
    aiCount = 0;
    aiTotalCount = 0;
    setIsTyped(false);
    await createInitialAI(true, chat, true);
  };

  const handleSave = async () => {
    setSaved('Saving...');

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
      content: plan.current,
    };

    await updateCampaign(updated, key, false, 'aiContent');
    await updateVersionsCallback();
  };

  const updatePlanCallback = (version) => {
    console.log('setting plan - callback!');
    plan.current = version.text;
  };

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    enableDragAndDropFileToEditor: false,
    useSearch: false,
    toolbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    toolbarInlineForSelection: true,
    showPlaceholder: false,
    buttons:
      'bold,italic,underline,strikethrough,ul,ol,fontsize,paragraph,copy,paste,hr,table,print',
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
              <SecondaryButton size="small">
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

          <div className="ml-3">
            <div className="text-indigo-100 p-1 md:mt-2">{saved}</div>
          </div>
        </div>

        <div className="flex w-full justify-end">
          {/* version button */}
          <PlanVersion
            campaign={campaign}
            versions={versions ? versions[key] : {}}
            updatePlanCallback={updatePlanCallback}
            latestVersion={campaign ? campaign[subSectionKey][key] : false}
          />

          <Actions
            slug={key}
            setDocumentName={setDocumentName}
            documentKey={key}
            name={documentName}
          />
        </div>
      </div>

      <div className="flex w-full h-auto justify-items-center justify-center">
        <div className="max-w-3xl w-full h-auto p-10 font-sfpro">
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
                      <JoditEditor
                        ref={editor}
                        value={plan.current}
                        config={config}
                        tabIndex={0}
                        onChange={(newContent) => {
                          if (typeof newContent === 'string') {
                            plan.current = newContent;
                            debounce(handleTypingComplete, undefined, 5000);
                          } else {
                            plan.current = newContent?.target?.innerHTML;
                            debounce(handleTypingComplete, undefined, 5000);
                          }
                        }}
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-center mt-6 py-6 hidden-for-print">
                    <AiModal
                      submitCallback={handleRegenerate}
                      showWarning={false}
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
