'use client'
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { camelToKebab } from 'helpers/stringHelper'
import { useEffect, useMemo, useState } from 'react'
import Actions from './Actions'
import { dateWithTime } from 'helpers/dateHelper'
import Link from 'next/link'
import { IoDocumentText } from 'react-icons/io5'
import LoadingList from '@shared/utils/LoadingList'
import { debounce } from 'helpers/debounceHelper'
import NewContentFlow from './NewContentFlow'
import { generateAIContent } from 'helpers/generateAIContent'
import {
  AI_CONTENT_SUB_SECTION_KEY,
  buildAiContentSections,
} from 'helpers/buildAiContentSections'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { useSnackbar } from 'helpers/useSnackbar'
import SimpleTable from '@shared/utils/SimpleTable'
import { CircularProgress } from '@mui/material'
import { Campaign, CampaignAiContent, AiContentData, CandidatePosition } from 'helpers/types'

// Type for values in CampaignAiContent index signature
type CampaignAiContentValue =
  | AiContentData
  | Partial<Record<string, string>>
  | Partial<Record<string, number>>
  | Partial<Record<string, { status?: string }>>
  | undefined

interface ChatMessage {
  role: string
  content: string
}

interface ContentRow {
  name: string
  updatedAt: Date
  slug: string
  documentKey: string
}

interface Category {
  name: string
  templates: { key: string; name: string }[]
}

interface MyContentProps {
  forceOpenModal?: boolean
  campaign?: Campaign | null
  requiresQuestions?: Partial<Record<string, boolean>>
  candidatePositions?: CandidatePosition[] | false | null
  categories?: Category[]
}

let aiTotalCount = 0
const excludedKeys = [
  'why',
  'aboutMe',
  'slogan',
  'policyPlatform',
  'communicationsStrategy',
  'messageBox',
  'mobilizing',
]

export default function MyContent(props: MyContentProps): React.JSX.Element {
  const [loading, setLoading] = useState(true)
  const [section, setSection] = useState('')
  const [sections, setSections] = useState<CampaignAiContent | undefined>(undefined)
  const [initialChat, setInitialChat] = useState<ChatMessage[] | undefined>(undefined)
  const [initialValues, setInitialValues] = useState<Partial<Record<string, string>>>({})
  const [campaign, setCampaign] = useState<Campaign | null | undefined>(undefined)
  const [campaignPlan, setCampaignPlan] = useState<CampaignAiContent | undefined>(undefined)
  const [jobStarting, setJobStarting] = useState(false)
  const [isFailed, setIsFailed] = useState(false)
  const { errorSnackbar } = useSnackbar()

  const onSelectPrompt = (key: string, additionalPrompts?: ChatMessage[], inputValues?: Partial<Record<string, string>>) => {
    setJobStarting(true)
    trackEvent('ai_content_generation_start', { key })
    if (additionalPrompts) {
      setInitialChat(additionalPrompts)
    }
    if (inputValues) {
      setInitialValues(inputValues)
    }
    setSection(key)
  }

  const columns = [
    {
      header: 'Name',
      cell: ({ row }: { row: ContentRow }) => {
        let updatedAt: string | undefined
        if (row.updatedAt) {
          updatedAt = dateWithTime(row.updatedAt)
          if (updatedAt === undefined || updatedAt === 'Invalid Date') {
            const now = new Date()
            updatedAt = dateWithTime(now)
          }
        }

        const content = (
          <div className="flex flex-row items-center font-semibold">
            <IoDocumentText className="ml-3 text-md shrink-0" />
            <div className="ml-3">{row.name}</div>
          </div>
        )

        if (!updatedAt) {
          return content
        }

        return (
          <Link
            href={`/dashboard/content/${row.slug}`}
            onClick={() => {
              trackEvent(EVENTS.ContentBuilder.ClickContent, {
                name: row.name,
                slug: row.slug,
                key: row.documentKey,
              })
            }}
            className="inline-block"
          >
            {content}
          </Link>
        )
      },
    },
    {
      header: 'Last Modified',
      cell: ({ row }: { row: ContentRow }) => {
        let updatedAt: string | undefined
        if (row.updatedAt) {
          updatedAt = dateWithTime(row.updatedAt)
          if (updatedAt === undefined || updatedAt === 'Invalid Date') {
            const now = new Date()
            updatedAt = dateWithTime(now)
          }
        }
        if (!updatedAt) {
          return (
            <div className="text-gray-500">
              <CircularProgress size={16} />
            </div>
          )
        }
        return updatedAt
      },
    },
    {
      header: '',
      cell: ({ row }: { row: ContentRow }) => {
        const actionProps = {
          slug: row.slug || '',
          name: row.name || '',
          documentKey: row.documentKey || '',
          updatedAt: row.updatedAt,
          status:
            row.updatedAt && dateWithTime(row.updatedAt) !== 'Invalid Date'
              ? undefined
              : 'processing',
        }
        return <Actions {...actionProps} />
      },
    },
  ]

  // Type guard to check if a value is AiContentData
  const isAiContentData = (value: CampaignAiContentValue): value is AiContentData => {
    return (
      typeof value === 'object' &&
      value !== null &&
      'name' in value &&
      'updatedAt' in value &&
      'content' in value
    )
  }

  const tableData = useMemo((): ContentRow[] => {
    if (!sections) return []

    return Object.entries(sections)
      .filter(([key, value]) => !excludedKeys.includes(key) && isAiContentData(value) && value.name)
      .map(([key, section]) => {
        // After filtering with isAiContentData, section is typed as AiContentData
        if (!isAiContentData(section)) return null
        return {
          name: section.name || '',
          updatedAt: new Date(section.updatedAt || Date.now()),
          slug: camelToKebab(key),
          documentKey: key,
        }
      })
      .filter((row): row is ContentRow => row !== null)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }, [sections])

  async function getUserCampaign() {
    const campaignObj = await getCampaign()
    if (campaignObj) {
      setCampaign(campaignObj)
      const campaignPlanObj = campaignObj[AI_CONTENT_SUB_SECTION_KEY]
      setCampaignPlan(campaignPlanObj)
      const [sectionsObj, jobsProcessing] = buildAiContentSections(
        campaignObj,
        AI_CONTENT_SUB_SECTION_KEY,
      )
      setSections(sectionsObj)
      setLoading(false)

      if (jobsProcessing) {
        handleJobProcessing()
      }
    } else {
      console.error('Failed to load campaign data')
      errorSnackbar('Failed to load campaign data. Please refresh the page.')
      setLoading(false)
      setCampaign(null)
      setSections({})
    }
  }

  const handleJobProcessing = () => {
    aiTotalCount++
    debounce(getUserCampaign, 10000)

    if (aiTotalCount >= 100) {
      errorSnackbar(
        'We are experiencing an issue creating your content. Please report an issue using the Feedback bar on the right.',
      )
      setLoading(false)
      setIsFailed(true)
      return
    }
  }

  useEffect(() => {
    initCampaign()
  }, [])

  const initCampaign = async () => {
    await getUserCampaign()
  }

  useEffect(() => {
    if (
      section &&
      section != '' &&
      campaign &&
      (!campaignPlan || !campaignPlan[section])
    ) {
      createAIContent({
        section,
        initialChat: initialChat || [],
        initialValues,
      })
    }
  }, [campaignPlan, section])

  const createAIContent = async ({
    section: sectionArg = '',
    initialChat: initialChatArg,
    initialValues: initialValuesArg,
  }: {
    section?: string
    initialChat?: ChatMessage[]
    initialValues?: Partial<Record<string, string>>
  }) => {
    const chatMessages: ChatMessage[] = initialChatArg || []
    const inputVals: Partial<Record<string, string>> = initialValuesArg || {}
    const result = await generateAIContent(
      sectionArg || '',
      chatMessages,
      inputVals,
    )

    if (result === false) {
      setJobStarting(false)
      setLoading(false)
      setInitialChat(undefined)
      errorSnackbar(
        'There was an error creating your content. Please Report an issue on the feedback bar on the right.',
      )
      return
    }

    const { chatResponse, status } = result

    if (!chatResponse && status === 'processing') {
      if (jobStarting === true) {
        await getUserCampaign()
        setJobStarting(false)
        setInitialChat(undefined)
      }
    } else {
      setJobStarting(false)
      setLoading(false)
      setInitialChat(undefined)
      errorSnackbar(
        'There was an error creating your content. Please Report an issue on the feedback bar on the right.',
      )
    }
  }

  return (
    <div>
      {loading ? (
        <div className="flex justify-center w-full">
          <LoadingList />
        </div>
      ) : isFailed ? (
        <div className="flex justify-center w-full text-red-500">
          Failed to load content. Please refresh the page.
        </div>
      ) : (
        <>
          <NewContentFlow
            onSelectCallback={onSelectPrompt}
            isProcessing={jobStarting}
            forceOpenModal={props.forceOpenModal}
            campaign={props.campaign || null}
            requiresQuestions={props.requiresQuestions || {}}
            candidatePositions={props.candidatePositions ?? null}
            categories={props.categories || []}
          />

          <SimpleTable columns={columns} data={tableData} />
        </>
      )}
    </div>
  )
}
