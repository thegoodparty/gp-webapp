'use client'
import ErrorButton from '@shared/buttons/ErrorButton'
import AlertDialog from '@shared/utils/AlertDialog'
import gpApi from 'gpApi'
import gpFetch from 'gpApi/gpFetch'
import { revalidateCandidates, revalidatePage } from 'helpers/cacheHelper'
import { useState } from 'react'
import { useSnackbar } from 'helpers/useSnackbar'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

async function deleteCampaign(id) {
  try {
    const payload = {
      id,
    }
    return await clientFetch(apiRoutes.admin.campaign.delete, payload)
  } catch (e) {
    console.error('error', e)
    return false
  }
}

async function deactivateCandidate(slug) {
  try {
    const api = gpApi.admin.deactivateCandidate
    const payload = {
      slug,
    }
    return await gpFetch(api, payload)
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export default function DeleteAction({ id, slug, isLive }) {
  const [showDelete, setShowDelete] = useState(false)
  const { successSnackbar } = useSnackbar()

  const handleDelete = async () => {
    if (isLive) {
      successSnackbar('hiding candidate')
      sna
      await deactivateCandidate(slug)
      successSnackbar('Hidden')
      setShowDelete(false)
    } else {
      successSnackbar('Deleting...')

      await deleteCampaign(id)
      successSnackbar('Deleted')
    }
    await revalidateCandidates()
    await revalidatePage('/admin/candidates')
    window.location.reload()
  }

  return (
    <>
      <div
        className="my-3"
        onClick={() => {
          setShowDelete(true)
        }}
      >
        <ErrorButton size="small" fullWidth>
          <span className="whitespace-nowrap">
            {isLive ? 'Hide Candidate' : 'Delete Campaign'}
          </span>
        </ErrorButton>
      </div>
      <AlertDialog
        open={showDelete}
        handleClose={() => {
          setShowDelete(false)
        }}
        title={isLive ? 'Hide Candidate' : 'Delete Campaign'}
        description={`Are you sure you want to ${
          isLive
            ? 'hide this candidate?'
            : 'delete this campaign? This cannot be undone.'
        }`}
        handleProceed={handleDelete}
      />
    </>
  )
}
