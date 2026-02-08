'use client'
import { useState, ChangeEvent } from 'react'
import Modal from '@shared/utils/Modal'
import { TextField } from '@mui/material'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import H2 from '@shared/typography/H2'
import H6 from '@shared/typography/H6'
import { useSnackbar } from 'helpers/useSnackbar'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

const renameContent = async (key: string, name: string): Promise<boolean> => {
  try {
    const payload = {
      key,
      name,
    }
    const resp = await clientFetch(apiRoutes.campaign.ai.rename, payload)
    if (resp?.ok) {
      return true
    } else {
      return false
    }
  } catch (e) {
    console.error('error', e)
    return false
  }
}

interface RenameActionProps {
  documentKey?: string
  showRename: boolean
  setShowRename: (show: boolean) => void
  setDocumentName?: (name: string) => void
  tableVersion?: boolean
  documentName?: string
}

const RenameAction = ({
  documentKey,
  showRename,
  setShowRename,
  setDocumentName,
  tableVersion,
  documentName = '',
}: RenameActionProps): React.JSX.Element => {
  const [newName, setNewName] = useState('')
  const { successSnackbar, errorSnackbar } = useSnackbar()

  const handleRename = async (key: string, name: string) => {
    const renameResp = await renameContent(key, name)
    if (renameResp === true) {
      successSnackbar('Renamed document')
      if (tableVersion === true) {
        window.location.href = '/dashboard/content'
      } else {
        setDocumentName?.(newName)
      }
    } else {
      errorSnackbar('Error renaming document')
    }
    setShowRename(false)
  }

  return (
    <>
      <Modal closeCallback={() => setShowRename(false)} open={showRename}>
        <div className="min-w-[80vw] lg:min-w-[740px]">
          <H2 className="pb-5 mb-5 border-b border-slate-500 text-center">
            Rename document
          </H2>
          <H6 className="mt-14 mb-2">Document name</H6>
          <TextField
            required
            variant="outlined"
            placeholder="Enter document name"
            inputProps={{ maxLength: 50 }}
            defaultValue={documentName ? documentName : ''}
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewName(e.target.value)
            }}
          />
          <div className="mt-16 flex w-full justify-end">
            <div
              onClick={() => {
                setShowRename(false)
              }}
            >
              <SecondaryButton>Cancel</SecondaryButton>
            </div>
            <div
              className="ml-3"
              onClick={() => {
                handleRename(documentKey!, newName)
              }}
            >
              <PrimaryButton
                disabled={newName.length === 0 || newName.length >= 50}
              >
                Save
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default RenameAction
