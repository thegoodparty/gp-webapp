'use client'

import AlertDialog from '@shared/utils/AlertDialog'
import { MoreMenu } from '@shared/utils/MoreMenu'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useState } from 'react'
import { useEcanvasserSurvey } from '@shared/hooks/useEcanvasserSurvey'

interface UpdateSurveyPayload {
  id: string
  status: string
}

interface MenuItem {
  label: string
  onClick: () => void
}

const updateSurvey = async (payload: UpdateSurveyPayload): Promise<void> => {
  await clientFetch(apiRoutes.ecanvasser.surveys.update, payload)
}

const deleteSurvey = async (id: string): Promise<void> => {
  await clientFetch(apiRoutes.ecanvasser.surveys.delete, {
    id,
  })
}

export default function EditSurvey(): React.JSX.Element {
  const [survey, refreshSurvey] = useEcanvasserSurvey()
  const [isOpen, setIsOpen] = useState(false)

  const { status } = survey || {}
  const menuItems: MenuItem[] = []
  const handlePublish = async (): Promise<void> => {
    const payload: UpdateSurveyPayload = {
      id: survey.id,
      status: survey.status === 'Live' ? 'Not Live' : 'Live',
    }
    await updateSurvey(payload)
    refreshSurvey()
  }

  const alertBeforeDelete = (): void => {
    setIsOpen(true)
  }

  const handleDelete = async (): Promise<void> => {
    await deleteSurvey(survey.id)
    window.location.href = '/dashboard/door-knocking/surveys'
  }

  if (status === 'Live') {
    menuItems.push({
      label: 'Unpublish door knocking script',
      onClick: handlePublish,
    })
  } else {
    menuItems.push({
      label: 'Publish door knocking script',
      onClick: handlePublish,
    })
  }

  menuItems.push({
    label: 'Delete door knocking script',
    onClick: alertBeforeDelete,
  })
  return (
    <>
      <MoreMenu menuItems={menuItems} />
      <AlertDialog
        open={isOpen}
        handleClose={() => setIsOpen(false)}
        title="Delete Door Knocking Script"
        description="Are you sure you want to delete this Door Knocking Script?"
        handleProceed={handleDelete}
      />
    </>
  )
}
