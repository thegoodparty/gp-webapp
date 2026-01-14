'use client'
import { useState } from 'react'
import ContentEditor from './ContentEditor'
import useVersions from 'app/(candidate)/onboarding/shared/useVerisons'
import { fetchCampaignVersions } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { kebabToCamel } from 'helpers/stringHelper'
import LoadingContent from './LoadingContent'
import { Campaign } from 'helpers/types'

type Versions = ReturnType<typeof useVersions>

interface EditContentPageProps {
  slug: string
  campaign: Campaign | null
}

export default function EditContentPage({ slug, campaign }: EditContentPageProps): React.JSX.Element {
  const section = kebabToCamel(slug)
  const subSectionKey = 'aiContent'

  const versions = useVersions()
  const [updatedVersions, setUpdatedVersions] = useState<Versions | false>(false)

  const updateVersionsCallback = async () => {
    const fetchedVersions: Versions = await fetchCampaignVersions()
    setUpdatedVersions(fetchedVersions)
  }

  return (
    <>
      {campaign != undefined ? (
        <ContentEditor
          section={section}
          campaign={campaign}
          versions={updatedVersions || versions}
          updateVersionsCallback={updateVersionsCallback}
          subSectionKey={subSectionKey}
        />
      ) : (
        <LoadingContent
          title="Loading your content ..."
          subtitle="Please wait"
        />
      )}
    </>
  )
}
