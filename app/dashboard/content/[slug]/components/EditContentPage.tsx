'use client'
import { useEffect, useRef, useState } from 'react'
import ContentEditor, { Versions } from './ContentEditor'
import useVersions from 'app/onboarding/shared/useVersions'
import { fetchCampaignVersions } from 'app/onboarding/shared/ajaxActions'
import { kebabToCamel } from 'helpers/stringHelper'
import LoadingContent from './LoadingContent'
import { useSnackbar } from 'helpers/useSnackbar'
import { Campaign } from 'helpers/types'

interface EditContentPageProps {
  slug: string
  campaign: Campaign | null
}

const EditContentPage = ({
  slug,
  campaign,
}: EditContentPageProps): React.JSX.Element => {
  const section = kebabToCamel(slug)

  const { data: versions, error: versionsError } = useVersions()
  const { errorSnackbar } = useSnackbar()
  const [updatedVersions, setUpdatedVersions] = useState<Versions | false>(
    false,
  )
  const versionsErrorReportedRef = useRef(false)

  useEffect(() => {
    if (!versionsError || versionsErrorReportedRef.current) return
    versionsErrorReportedRef.current = true
    console.error('Failed to load campaign versions', versionsError)
    errorSnackbar('Could not load version history. You can still edit content.')
  }, [versionsError, errorSnackbar])

  const updateVersionsCallback = async () => {
    const fetchedVersions = await fetchCampaignVersions()
    setUpdatedVersions(fetchedVersions)
  }

  return (
    <>
      {campaign != undefined ? (
        <ContentEditor
          section={section}
          campaign={campaign}
          versions={updatedVersions || versions || {}}
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
