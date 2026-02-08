'use client'
import ErrorButton from '@shared/buttons/ErrorButton'
import AlertDialog from '@shared/utils/AlertDialog'
import { revalidatePage } from 'helpers/cacheHelper'
import { useState, ChangeEvent } from 'react'
import Modal from '@shared/utils/Modal'
import { useSnackbar } from 'helpers/useSnackbar'

interface BustCacheButtonProps {
  name: string
  description: string
  paths: string[]
}

export default function BustCacheButton({
  name,
  description,
  paths,
}: BustCacheButtonProps): React.JSX.Element {
  const [showBustCache, setShowBustCache] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [customPath, setCustomPath] = useState('')
  const handleOpenModal = () => {
    setShowModal(true)
  }
  const { successSnackbar, errorSnackbar } = useSnackbar()

  const handleBustCache = async () => {
    successSnackbar(`Busting Cache: ${description}...`)

    let success = false
    if (customPath === '') {
      for (const path of paths) {
        const revalidateResp = await revalidatePage(path)
        if (revalidateResp?.success) {
          success = true
        } else {
          success = false
        }
      }
    } else {
      const revalidateResp = await revalidatePage(customPath)
      if (revalidateResp?.success) {
        success = true
      } else {
        success = false
      }
      setCustomPath('')
    }

    setShowBustCache(false)

    if (success) {
      successSnackbar(`Cached Busted: ${description}`)
    } else {
      errorSnackbar(`Error Busting Cache: ${description}`)
    }
  }

  return (
    <>
      <div
        className="my-3"
        onClick={() => {
          if (name === 'custom path') {
            handleOpenModal()
          } else {
            setShowBustCache(true)
          }
        }}
      >
        <ErrorButton size="small" fullWidth>
          <span className="whitespace-nowrap">{description}</span>
        </ErrorButton>
      </div>
      <AlertDialog
        open={showBustCache}
        handleClose={() => {
          setShowBustCache(false)
        }}
        title="Bust Cache?"
        description={`Are you sure you want to: ${description} ?`}
        handleProceed={handleBustCache}
        redButton={false}
      />

      <Modal
        open={showModal}
        closeCallback={() => {
          setShowModal(false)
        }}
      >
        <h2 className="text-2xl font-black my-6">Enter the path to bust.</h2>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          type="text"
          placeholder="/candidate/[slug]"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const path = e.target.value
            setCustomPath(path)
          }}
        />
        <div onClick={handleBustCache}>
          <ErrorButton size="small" fullWidth>
            Bust Cache
          </ErrorButton>
        </div>
      </Modal>
    </>
  )
}
