'use client'
import { revalidatePage } from 'helpers/cacheHelper'
import SuccessButton from '@shared/buttons/SuccessButton'
import { useState } from 'react'
import { useAdminCampaign } from '@shared/hooks/useAdminCampaign'
import { useSnackbar } from 'helpers/useSnackbar'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

const rerunP2V = async (slug: string) => {
  try {
    const resp = await clientFetch(apiRoutes.campaign.pathToVictory.create, {
      slug,
    })

    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export default function RerunP2V(): React.JSX.Element {
  const [campaign, , refreshCampaign] = useAdminCampaign()
  const [processing, setProcessing] = useState(false)
  const { successSnackbar, errorSnackbar } = useSnackbar()

  const handleRerun = async () => {
    if (processing || !campaign) return
    setProcessing(true)
    const response = await rerunP2V(campaign.slug)
    if (response) {
      successSnackbar('Path to victory rerun')
      await revalidatePage('/admin/victory-path/[slug]')
      await refreshCampaign()
    } else {
      errorSnackbar('Error rerunning path to victory')
      setProcessing(false)
    }
  }

  return (
    <div className="my-4" onClick={handleRerun}>
      <SuccessButton disabled={processing}>Rerun Path to Victory</SuccessButton>
    </div>
  )
}
