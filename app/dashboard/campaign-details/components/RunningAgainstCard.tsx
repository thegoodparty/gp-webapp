import { useState } from 'react'
import IconButton from '@shared/buttons/IconButton'
import { DeleteRounded, EditRounded } from '@mui/icons-material'
import RunningAgainstForm from './RunningAgainstForm'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { RunningAgainst } from 'helpers/types'

interface RunningAgainstCardProps extends RunningAgainst {
  onDelete: () => void
  onUpdate: (newValues: RunningAgainst) => void
}

export default function RunningAgainstCard({
  name,
  party,
  description,
  onDelete,
  onUpdate,
}: RunningAgainstCardProps): React.JSX.Element {
  const [showEdit, setShowEdit] = useState(false)

  function handleSave(newValues: RunningAgainst): void {
    trackEvent(EVENTS.Profile.RunningAgainst.SubmitEdit)
    setShowEdit(false)
    onUpdate(newValues)
  }

  function handleDelete(): void {
    trackEvent(EVENTS.Profile.RunningAgainst.ClickDelete)
    onDelete()
  }

  function handleEdit(): void {
    trackEvent(EVENTS.Profile.RunningAgainst.ClickEdit)
    setShowEdit(true)
  }

  function handleCancel(): void {
    trackEvent(EVENTS.Profile.RunningAgainst.CancelEdit)
    setShowEdit(false)
  }

  return (
    <div className="my-6 border rounded-xl p-4 border-gray-300 flex justify-between">
      {!showEdit ? (
        <>
          <div>
            <div className="font-bold mb-2">{name}</div>
            <div>{party}</div>
            <div>{description}</div>
          </div>
          <div>
            <IconButton
              title="Delete"
              className="flex items-center"
              color="error"
              onClick={handleDelete}
            >
              <DeleteRounded />
            </IconButton>
            <IconButton
              title="Edit"
              className="flex items-center"
              onClick={handleEdit}
            >
              <EditRounded />
            </IconButton>
          </div>
        </>
      ) : (
        <RunningAgainstForm
          name={name}
          party={party}
          description={description}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
