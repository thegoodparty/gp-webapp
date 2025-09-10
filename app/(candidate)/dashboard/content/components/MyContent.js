'use client'
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { camelToKebab } from 'helpers/stringHelper'
import { useEffect, useMemo, useState } from 'react'
import Actions from './Actions'
import { dateWithTime } from 'helpers/dateHelper'
import Link from 'next/link'
import { IoDocumentText } from 'react-icons/io5'
import LoadingList from '@shared/utils/LoadingList'
import { debounce } from '/helpers/debounceHelper'
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

export default function MyContent(props) {
  const [loading, setLoading] = useState(true)
  const [section, setSection] = useState('')
  const [sections, setSections] = useState(undefined)
  const [initialChat, setInitialChat] = useState(false)
  const [initialValues, setInitialValues] = useState({})
  const [campaign, setCampaign] = useState(undefined)
  const [campaignPlan, setCampaignPlan] = useState(undefined)
  const [jobStarting, setJobStarting] = useState(false)
  const { errorSnackbar } = useSnackbar()

  const onSelectPrompt = (key, additionalPrompts, inputValues) => {
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
      cell: ({ row }) => {
        let updatedAt
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
      cell: ({ row }) => {
        let updatedAt
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
      cell: ({ row }) => {
        const actionProps = {
          slug: row.slug || '',
          name: row.name || '',
          documentKey: row.documentKey || '',
          updatedAt: row.updatedAt,
          status:
            row.updatedAt && row.updatedAt !== 'Invalid Date'
              ? undefined
              : 'processing',
        }
        return <Actions {...actionProps} />
      },
    },
  ]

  const tableData = useMemo(() => {
    if (!sections) return []

    return Object.entries(sections)
      .filter(([key]) => !excludedKeys.includes(key) && sections[key].name)
      .map(([key, section]) => ({
        name: section.name,
        updatedAt: new Date(section.updatedAt),
        slug: camelToKebab(key),
        documentKey: key,
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt)
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
        initialChat,
        initialValues,
      })
    }
  }, [campaignPlan, section])

  const createAIContent = async ({
    section = '',
    initialChat = [],
    initialValues = {},
  }) => {
    if (initialChat === false) {
      initialChat = []
    }
    const { chatResponse, status } = await generateAIContent(
      section,
      initialChat,
      initialValues,
    )

    if (!chatResponse && status === 'processing') {
      if (jobStarting === true) {
        await getUserCampaign()
        setJobStarting(false)
        setInitialChat(false)
      }
    } else {
      setJobStarting(false)
      setLoading(false)
      setInitialChat(false)
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
      ) : (
        <>
          <NewContentFlow
            {...props}
            onSelectCallback={onSelectPrompt}
            isProcessing={jobStarting}
            forceOpenModal={props.forceOpenModal}
          />

          <SimpleTable columns={columns} data={tableData} />
        </>
      )}
    </div>
  )
}
