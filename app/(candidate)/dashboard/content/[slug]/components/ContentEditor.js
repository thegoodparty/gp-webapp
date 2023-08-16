'use client';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import PlanVersion from './PlanVersion';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import LoadingAI from 'app/(candidate)/onboarding/[slug]/campaign-plan/components/LoadingAI';
import BlackButton from '@shared/buttons/BlackButton';
import AiModal from 'app/(candidate)/onboarding/[slug]/campaign-plan/components/AiModal';
// import Typewriter from 'typewriter-effect';
import { FaSave } from 'react-icons/fa';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import Link from 'next/link';
import Actions from '../../components/Actions';
import { debounce } from '/helpers/debounceHelper';
import JoditEditor from 'jodit-react';

// const RichEditor = dynamic(
//   () =>
//     import(
//       'app/(candidate)/onboarding/[slug]/campaign-plan/components/RichEditor'
//     ),
//   {
//     loading: () => (
//       <p className="p-4 text-center text-2xl font-bold">Loading Editor...</p>
//     ),
//   },
// );

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
  const [editMode, setEditMode] = useState(true);
  const [isEdited, setIsEdited] = useState(false);
  const [plan, setPlan] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [isTyped, setIsTyped] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // dirty text means unsaved
  const snackbarState = useHookstate(globalSnackbarState);
  const [documentName, setDocumentName] = useState('Untitled Document');
  const editor = useRef(null);

  const campaignPlan = campaign[subSectionKey];
  const key = section;

  useEffect(() => {
    if (campaignPlan && campaignPlan[key]) {
      console.log('setting plan - content!', campaignPlan[key].content);
      setPlan(campaignPlan[key].content);
      setDocumentName(campaignPlan[key].name);
      setLoading(false);
      setIsTyped(true);
    }
  }, [campaignPlan]);

  useEffect(() => {
    if (editor != null && plan != false && initialized != true) {
      console.log('muhplan', plan);
      console.log('SETTING PLAN!');
      editor.current.value = plan;
      setInitialized(true);

      // check that editor has the function setEditorValue
      // if (editor?.current?.setEditorValue) {
      // }
    }
  }, [editor, plan]);

  // const toggleSelect = () => {
  //   setOpen(!open);
  // };

  // const setEdit = () => {
  //   setIsEdited(true);
  //   setEditMode(true);
  // };

  const handleEdit = async (editedPlan) => {
    console.log('setting plan - editedPlan!', editedPlan);
    setPlan(editedPlan);
  };

  // Function to be called when the user has finished typing
  const handleTypingComplete = async () => {
    setIsDirty(true);
    console.log('calling handle save...');
    await handleSave();
  };

  // useEffect(() => {
  //   // Set up a timer to trigger save when typing is complete
  //   debounce(handleTypingComplete, undefined, 5000); // Adjust the delay as needed
  // }, [plan]);

  const handleRegenerate = async (improveQuery) => {
    setLoading(true);
    let chat = [];
    if (improveQuery !== '') {
      chat = [
        { role: 'system', content: plan },
        { role: 'user', content: improveQuery },
      ];
    }
    console.log('setting plan - false!');
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
    // setIsEdited(true);
    // setEditMode(true);
    await updateCampaign(updated, key, false, 'aiContent');
    await updateVersionsCallback();
    setIsDirty(false); // Reset the dirty flag
    // router.push(`/onboarding/${campaign.slug}/dashboard/1`);
  };

  const updatePlanCallback = (version) => {
    console.log('setting plan - callback!');
    setPlan(version.text);
    // setIsEdited(true);
  };

  // const expand = open || forceExpand;

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

          {/* <div className="ml-3">
            <div className="text-indigo-100 p-1 md:mt-2">Saved</div>
          </div> */}
        </div>

        <div className="flex w-full justify-end">
          {/* version button */}
          <PlanVersion
            campaign={campaign}
            versions={versions ? versions[key] : {}}
            updatePlanCallback={updatePlanCallback}
            latestVersion={campaignPlan ? campaignPlan[key] : false}
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
                      <>
                        {/* <RichEditor
                          initialText={plan}
                          onChangeCallback={handleEdit}
                          // sx={{'jd-color-border': '#ffffff'}}
                        /> */}

                        <JoditEditor
                          ref={editor}
                          // value={plan}
                          config={config}
                          tabIndex={0} // tabIndex of textarea
                          autofocus={true}
                          cursorAfterAutofocus="end" // 'start';
                          // defaultMode="wysiwyg"
                          onChange={(newContent) => {
                            console.log('newContent', newContent);
                            if (typeof newContent === 'string') {
                              if (newContent != '<p><br></p>') {
                                // setting Plan makes the component re-render and jodit loses focus.
                                // setPlan(newContent);
                                // handleEdit(newContent);
                              }
                            } else {
                              setPlan(newContent?.target?.innerHTML);

                              // handleEdit(newContent?.target?.innerHTML);
                            }
                          }}
                          // onBlur={(newContent) => {
                          //   if (typeof newContent === 'string') {
                          //     onBlur(newContent);
                          //   } else {
                          //     // preferred to use only this option to update the content for performance reasons
                          //     onBlur(newContent?.target?.innerHTML);
                          //   }
                          // }}
                        />
                      </>
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
