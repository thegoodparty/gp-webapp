'use client'
import ErrorButton from '@shared/buttons/ErrorButton'
import AlertDialog from '@shared/utils/AlertDialog'
import gpApi from 'gpApi'
import gpFetch from 'gpApi/gpFetch'
import { revalidateCandidates, revalidatePage } from 'helpers/cacheHelper'

import { useState } from 'react'
import { useSnackbar } from 'helpers/useSnackbar'

async function deleteCandidate(id: number) {
  try {
    const api = gpApi.admin.deleteCandidate
    const payload = {
      id,
    }
    return await gpFetch(api, payload)
  } catch (e) {
    console.error('error', e)
    return false
  }
}

interface DeleteActionProps {
  id: number
}

export default function DeleteAction({ id }: DeleteActionProps): React.JSX.Element {
  const [showDelete, setShowDelete] = useState(false)
  const { successSnackbar } = useSnackbar()

  const handleDelete = async () => {
    successSnackbar('deleting candidate')
    await deleteCandidate(id)
    successSnackbar('Deleted')
    setShowDelete(false)

    await revalidateCandidates()
    await revalidatePage('/admin/all-candidates')
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
          <span className="whitespace-nowrap">Delete Forever</span>
        </ErrorButton>
      </div>
      <AlertDialog
        open={showDelete}
        handleClose={() => {
          setShowDelete(false)
        }}
        title="Delete candidate"
        description="Are you sure you want to delete this candidate? This cannot be undone."
        handleProceed={handleDelete}
      />
    </>
  )
}
