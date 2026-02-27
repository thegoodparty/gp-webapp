'use client'
import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import PlanVersion from './PlanVersion'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import LoadingContent from './LoadingContent'
import BlackButton from '@shared/buttons/BlackButton'
import { MdAutoAwesome, MdOutlineArrowBackIos } from 'react-icons/md'
import { FaGlobe } from 'react-icons/fa'
import Actions from '../../components/Actions'
import { debounce } from 'helpers/debounceHelper'
import { LuClipboard } from 'react-icons/lu'
import CopyToClipboard from '@shared/utils/CopyToClipboard'
import InputFieldsModal from '../../components/InputFieldsModal'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import {
  fetchPromptInputFields,
  PromptInputField,
} from 'helpers/fetchPromptInputFields'
import Button from '@shared/buttons/Button'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { Campaign, AiContentData } from 'helpers/types'

// Type for values in CampaignAiContent index signature
type CampaignAiContentValue =
  | AiContentData
  | Partial<Record<string, string>>
  | Partial<Record<string, number>>
  | Partial<Record<string, { status?: string }>>
  | undefined

const RichEditor = dynamic(() => import('app/shared/utils/RichEditor'), {
  ssr: false,
  loading: () => (
    <p className="p-4 text-center text-2xl font-bold">Loading Editor...</p>
  ),
})

interface ChatMessage {
  role: string
  content: string
}

export interface Version {
  date: string
  name?: string
  key?: string
  language?: string
  text?: string
  inputValues?: Partial<Record<string, string>>
}

export type Versions = Partial<
  Record<string, string | number | boolean | object | null>
>

interface ContentEditorProps {
  section?: string
  campaign: Campaign
  versions?: Versions
  updateVersionsCallback: () => Promise<void>
}

interface GenerateAIResponse {
  chatResponse?: { content: string }
  status?: string
}

// Type guard to check if aiContent value is actual content data
function isAiContentData(
  value: CampaignAiContentValue,
): value is AiContentData {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  return 'content' in value && 'name' in value && 'updatedAt' in value
}

let aiCount = 0
let aiTotalCount = 0

export default function ContentEditor({
  section = '',
  campaign,
  versions = {},
  updateVersionsCallback,
}: ContentEditorProps): React.JSX.Element {
  const [plan, setPlan] = useState<string | false>(false)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [isFailed, setIsFailed] = useState(false)
  const [documentName, setDocumentName] = useState('Untitled Document')
  const [saved, setSaved] = useState('Saved')
  const [inputFields, setInputFields] = useState<PromptInputField[]>([])
  const [initialInputValues, setInitialInputValues] = useState<
    Partial<Record<string, string>>
  >({})
  const [showModal, setShowModal] = useState(false)
  const [showTranslate, setShowTranslate] = useState(false)

  const campaignPlan = campaign.aiContent
  const key = section
  const sectionData = campaignPlan?.[key]

  useEffect(() => {
    if (campaignPlan && sectionData && isAiContentData(sectionData)) {
      setPlan(sectionData.content)
      setDocumentName(sectionData.name)
      setLoading(false)
      setRegenerating(false)
      loadInputFields()
      loadInputValues()
    }
  }, [campaignPlan])

  const loadInputFields = async () => {
    const keyNoDigits = key.replace(/\d+$/, '')
    const content = await fetchPromptInputFields(keyNoDigits)
    if (content) {
      setInputFields(content)
    } else {
      setInputFields([])
    }
  }

  const loadInputValues = async () => {
    if (
      sectionData &&
      isAiContentData(sectionData) &&
      sectionData.inputValues
    ) {
      setInitialInputValues(sectionData.inputValues)
    }
  }

  const handleEdit = async (editedPlan: string, debounceTime = 5000) => {
    setPlan(editedPlan)
    if (
      sectionData &&
      isAiContentData(sectionData) &&
      sectionData.content != plan
    ) {
      debounce(handleTypingComplete, debounceTime)
    }
  }

  // Function to be called when the user has finished typing
  const handleTypingComplete = async () => {
    await handleSave()
  }

  const handleSave = async () => {
    setSaved('Saving...')

    let existingName: string | undefined
    let existingInputs: Partial<Record<string, string>> = {}
    const existingData = campaign.aiContent?.[key]
    if (isAiContentData(existingData)) {
      existingName = existingData.name
      existingInputs = existingData.inputValues || {}
    }

    const now = new Date()
    const updatedAt = now.valueOf()

    const newVal = {
      name: existingName ? existingName : key,
      updatedAt,
      inputValues: existingInputs,
      content: plan,
    }

    await updateCampaign([{ key: `aiContent.${key}`, value: newVal }])
    setSaved('Saved')
  }

  const updatePlanCallback = (version: Version | null) => {
    if (version) {
      setPlan(version.text || '')
      setInitialInputValues(version.inputValues || {})
    }
  }

  async function generateAI(
    aiKey: string,
    regenerate: boolean,
    chat: ChatMessage[],
    editMode: boolean,
    inputValues: Partial<Record<string, string>> = {},
  ): Promise<GenerateAIResponse | false> {
    try {
      const resp = await clientFetch<GenerateAIResponse>(
        apiRoutes.campaign.ai.create,
        {
          key: aiKey,
          regenerate,
          chat,
          editMode,
          inputValues,
        },
      )
      return resp.data || false
    } catch (e) {
      console.error('error', e)
      return false
    }
  }

  const createInitialAI = async (
    regenerate = false,
    chat: ChatMessage[] = [],
    editMode = false,
    inputValues: Partial<Record<string, string>> = {},
  ) => {
    aiCount++
    aiTotalCount++
    if (aiTotalCount >= 100) {
      //fail
      setPlan('Failed to generate a campaign plan. Please contact us for help.')
      setLoading(false)
      setRegenerating(false)
      setIsFailed(true)
      return
    }

    const result = await generateAI(
      key,
      regenerate,
      chat,
      editMode,
      inputValues,
    )
    if (result === false) {
      setIsFailed(true)
      setLoading(false)
      return
    }
    const { chatResponse, status } = result
    if (!chatResponse && status === 'processing') {
      if (aiCount < 40) {
        setTimeout(async () => {
          await createInitialAI()
        }, 5000)
      } else {
        //something went wrong, we are stuck in a loop. reCreate the response
        console.log('regenerating')
        aiCount = 0
        createInitialAI(true)
      }
    } else {
      aiCount = 0
      if (status === 'completed' && chatResponse) {
        setPlan(chatResponse.content)
        await updateVersionsCallback()
        setLoading(false)
        setRegenerating(false)
        setSaved('Saved')
      }
    }
  }

  const handleAdditionalInput = async (
    additionalPrompt: string,
    inputValues: Partial<Record<string, string>>,
  ) => {
    trackEvent(EVENTS.ContentBuilder.Editor.SubmitRegenerate, {
      name: documentName,
      key,
    })
    setLoading(true)
    setInitialInputValues(inputValues)
    const chat: ChatMessage[] = [
      // the re-generate does not need the context of the old plan.
      // { role: 'system', content: plan },
      { role: 'user', content: additionalPrompt },
    ]
    await createInitialAI(true, chat, true, inputValues)

    setShowModal(false)
  }

  const handleTranslate = async (language: string) => {
    setLoading(true)
    setInitialInputValues({})
    const planContent = typeof plan === 'string' ? plan : ''
    const chat: ChatMessage[] = [
      { role: 'system', content: planContent },
      {
        role: 'user',
        content: 'Please translate the above text to: ' + language,
      },
    ]
    await createInitialAI(true, chat, true, { language: language })

    setShowModal(false)
  }

  const initialText = useMemo(
    () =>
      (sectionData && isAiContentData(sectionData)
        ? sectionData.content
        : '') || '',
    [sectionData],
  )

  return (
    <div>
      <div className="flex w-full h-auto p-5 items-center justify-items-center bg-indigo-50">
        <div className="flex justify-start">
          <Button
            href="/dashboard/content"
            color="neutral"
            className="flex items-center whitespace-nowrap"
          >
            <MdOutlineArrowBackIos className="text-sm" />
            <span className="hidden md:inline">&nbsp; Back</span>
          </Button>

          {/* desktop new document name. (not shown on mobile) */}
          <div className="ml-5 hidden md:block whitespace-nowrap">
            <div className="text-indigo-800 p-1 md:mt-2">{documentName}</div>
          </div>

          <div className="ml-1 mr-1">
            <div
              className={`p-1 mt-2 ml-3 ${
                saved === 'Saving...' ? 'text-primary' : 'text-indigo-400'
              }`}
            >
              {saved}
            </div>
          </div>
        </div>

        <div className="flex w-full justify-end items-center justify-items-center">
          {inputFields && (
            <div
              className="mr-3"
              onClick={() => {
                trackEvent(EVENTS.ContentBuilder.Editor.ClickRegenerate, {
                  name: documentName,
                  key,
                })
                setShowModal(true)
              }}
            >
              <PrimaryButton size="medium">
                <div className="flex items-center">
                  <MdAutoAwesome className="mr-2" />
                  Regenerate
                </div>
              </PrimaryButton>
            </div>
          )}
          {/* copy button mobile */}
          <div className="md:hidden mr-3">
            <CopyToClipboard text={typeof plan === 'string' ? plan : ''}>
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
            <CopyToClipboard
              text={typeof plan === 'string' ? plan : ''}
              onCopy={() => {
                trackEvent(EVENTS.ContentBuilder.Editor.ClickCopy, {
                  name: documentName,
                  key,
                })
              }}
            >
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
              trackEvent(EVENTS.ContentBuilder.Editor.ClickTranslate, {
                name: documentName,
                key,
              })
              setShowTranslate(true)
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
            versions={Array.isArray(versions?.[key]) ? versions[key] : []}
            updatePlanCallback={updatePlanCallback}
            latestVersion={
              sectionData && isAiContentData(sectionData)
                ? {
                    date: new Date().toISOString(),
                    text: sectionData.content,
                    inputValues: initialInputValues,
                  }
                : null
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
          <section key={section} className="my-3">
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
                          initialText={initialText}
                          onChangeCallback={handleEdit}
                          useOnChange
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
  )
}
