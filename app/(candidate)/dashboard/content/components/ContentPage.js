'use client'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../shared/DashboardLayout'
import TitleSection from '../../shared/TitleSection'
import ContentTutorial from './ContentTutorial'
import MyContent from './MyContent'
import { getCookie } from 'helpers/cookieHelper'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

export default function ContentPage(props) {
  const [forceOpenModal, setForceOpenModal] = useState(false)
  // check the query for showModal and then force modal
  const searchParams = useSearchParams()
  const modalParam = searchParams.get('showModal')
  useEffect(() => {
    if (modalParam) {
      setForceOpenModal(true)
    }
  }, [modalParam])

  const newContentCallback = () => {
    setForceOpenModal(true)
  }
  const cookie = getCookie('tutorial-content')
  const shouldShowTutorial =
    !cookie && !props.campaign?.aiContent && !forceOpenModal
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
        <ContentTutorial newContentCallback={newContentCallback} />
      )}
    </DashboardLayout>
  )
}
