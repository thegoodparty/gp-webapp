'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import DashboardLayout from '../../shared/DashboardLayout'
import TitleSection from '../../shared/TitleSection'
import MyContent from './MyContent'
import { getCookie } from 'helpers/cookieHelper'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import {
  Campaign,
  CandidatePosition,
  PathToVictoryData,
  User,
} from 'helpers/types'

const ContentTutorial = dynamic(() => import('./ContentTutorial'), {
  ssr: false,
})

interface Prompt {
  key: string
  title: string
}

interface Category {
  name: string
  templates: { key: string; name: string }[]
}

interface ContentPageProps {
  campaign: Campaign | null
  pathname?: string
  prompts?: Prompt[]
  templates?: object
  categories?: Category[]
  pathToVictory?: PathToVictoryData
  requiresQuestions?: Partial<Record<string, boolean>>
  candidatePositions?: CandidatePosition[] | false
  user?: User | null
}

const ContentPage = (props: ContentPageProps): React.JSX.Element => {
  const campaign = props.campaign
  const [forceOpenModal, setForceOpenModal] = useState(false)
  const searchParams = useSearchParams()
  const modalParam = searchParams?.get('showModal')
  useEffect(() => {
    if (modalParam) {
      setForceOpenModal(true)
    }
  }, [modalParam])

  const newContentCallback = () => {
    setForceOpenModal(true)
  }

  const handleTutorialComplete = (_templateKey: string) => {
    setForceOpenModal(true)
  }
  const cookie = getCookie('tutorial-content')
  const shouldShowTutorial = !cookie && !campaign?.aiContent && !forceOpenModal
  return (
    <DashboardLayout {...props}>
      <TitleSection
        title="Content Builder"
        subtitle={
          <div className="flex items-start">
            <Image
              className="mr-1 mt-0.5"
              src="/images/logo/heart.svg"
              data-cy="logo"
              width={18}
              height={14}
              alt="GoodParty.org"
              priority
            />
            <span>
              AI can help you create high quality personalized content for your
              campaign in seconds.
            </span>
          </div>
        }
        image="/images/dashboard/content.svg"
        imgWidth={120}
        imgHeight={120}
      />
      <MyContent {...props} forceOpenModal={forceOpenModal} />
      {shouldShowTutorial && (
        <ContentTutorial
          newContentCallback={newContentCallback}
          onCompleteCallback={handleTutorialComplete}
        />
      )}
    </DashboardLayout>
  )
}

export default ContentPage
