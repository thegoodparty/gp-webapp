'use client'
import ErrorButton from '@shared/buttons/ErrorButton'
import AlertDialog from '@shared/utils/AlertDialog'
import { useState, ChangeEvent } from 'react'
import TextField from '@shared/inputs/TextField'
import gpApi from 'gpApi'
import gpFetch from 'gpApi/gpFetch'
import { revalidatePage } from 'helpers/cacheHelper'

export const deleteCandidate = async (path: string) => {
  try {
    const api = gpApi.admin.deleteCandidate
    const payload = {
      slug: path.replace('/candidate/', ''),
    }
    return await gpFetch(api, payload)
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export default function DeleteCandidate(): React.JSX.Element {
  const [showWarning, setShowWarning] = useState(false)
  const [path, setPath] = useState('')

  const handleWarning = () => {
    setShowWarning(true)
  }

  const handleDelete = async () => {
    await deleteCandidate(path)
    await revalidatePage('/candidate/[name]/[office]')
    setShowWarning(false)
    setPath('')
  }

  const validPath = () => {
    return path.length > 0 && path.startsWith('/candidate/')
  }
  return (
    <>
      <div className="flex mt-4">
        <div className="flex-1 pr-2">
          <TextField
            label="Path"
            placeholder="/candidate/[name]/[office]"
            fullWidth
            value={path}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPath(e.target.value)
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <ErrorButton onClick={handleWarning} disabled={!validPath()}>
          <span className="whitespace-nowrap">Delete Candidate</span>
        </ErrorButton>
      </div>
      <AlertDialog
        open={showWarning}
        handleClose={() => {
          setShowWarning(false)
        }}
        title="Delete Candidate?"
        description={`Are you sure you want to delete ${path}?`}
        handleProceed={handleDelete}
        redButton={false}
      />
    </>
  )
}
