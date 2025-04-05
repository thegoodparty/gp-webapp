'use client'
import AlertDialog from '@shared/utils/AlertDialog'
import { useState } from 'react'
import { useSnackbar } from 'helpers/useSnackbar'
import Button from '@shared/buttons/Button'

export default function DeleteAction({
  id,
  setShowMenu,
  deleteHistoryCallBack,
  description,
}) {
  const [showDelete, setShowDelete] = useState(false)
  const { successSnackbar } = useSnackbar()

  const handleDelete = async () => {
    setShowMenu(0)
    successSnackbar('Deleting...')
    await deleteHistoryCallBack(id)
    successSnackbar('Deleted')
  }

  return (
    <>
      <div className="my-3">
        <Button
          onClick={() => {
            setShowDelete(true)
          }}
          size="small"
          color="error"
          className="w-full"
        >
          <span className="whitespace-nowrap">Delete</span>
        </Button>
      </div>
      <AlertDialog
        open={showDelete}
        handleClose={() => {
          setShowDelete(false)
        }}
        redButton={false}
        title="Delete Campaign Action"
        description={description}
        handleProceed={handleDelete}
        proceedLabel="Delete"
      />
    </>
  )
}
