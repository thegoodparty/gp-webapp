'use client'
import { useState } from 'react'
import ContentEditor from './ContentEditor'
import useVersions from 'app/(candidate)/onboarding/shared/useVerisons'
import { fetchCampaignVersions } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { kebabToCamel } from 'helpers/stringHelper'
import LoadingContent from './LoadingContent'
import { Campaign } from 'helpers/types'

// useVersions returns a loose type that we need to accept
type Versions = Partial<Record<string, string | number | boolean | object | null>>

interface EditContentPageProps {
  slug: string
  campaign: Campaign | null
}

const EditContentPage = ({
  slug,
  campaign,
}: EditContentPageProps): React.JSX.Element => {
  const section = kebabToCamel(slug)

  const versions = useVersions()
  const [updatedVersions, setUpdatedVersions] = useState<Versions | false>(
    false,
  )

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

export default EditContentPage
