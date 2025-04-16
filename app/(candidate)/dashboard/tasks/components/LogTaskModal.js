import { useState } from 'react'
import Modal from '@shared/utils/Modal'
import TextField from '@shared/inputs/TextField'
import H1 from '@shared/typography/H1'
import Button from '@shared/buttons/Button'
import { useVoterContacts } from '@shared/hooks/useVoterContacts'
import { useCampaignUpdateHistory } from '@shared/hooks/useCampaignUpdateHistory'
import { useUser } from '@shared/hooks/useUser'
import {
  createIrresponsiblyMassagedHistoryItem,
  createUpdateHistory,
} from '@shared/utils/campaignUpdateHistoryServices'
import { TASK_TYPES } from '../constants/tasks.const'

export const TASK_TYPE_HEADINGS = {
  [TASK_TYPES.text]: 'How many text messages did you schedule?',
  [TASK_TYPES.robocall]: 'How many robocalls did you schedule?',
  [TASK_TYPES.doorKnocking]: 'How many doors did you knock?',
  [TASK_TYPES.phoneBanking]: 'How many calls did you make?',
  [TASK_TYPES.socialMedia]: 'How manyviews did your post get?',
  [TASK_TYPES.events]: 'How many voters did you meet?',
}

export const TASK_TYPE_LABELS = {
  [TASK_TYPES.text]: 'Text Messages Scheduled',
  [TASK_TYPES.robocall]: 'Robocalls Scheduled',
  [TASK_TYPES.doorKnocking]: 'Doors Knocked',
  [TASK_TYPES.phoneBanking]: 'Calls Made',
  [TASK_TYPES.socialMedia]: 'Social Post Views',
  [TASK_TYPES.events]: 'Voters Met',
}

export default function LogTaskModal({ onSubmit, onClose, flowType }) {
  const modalTitle = TASK_TYPE_HEADINGS[flowType]
  const modalLabel = TASK_TYPE_LABELS[flowType]
  const [reportedVoterGoals, setReportedVoterGoals] = useVoterContacts()
  const [updateHistoryItems, setUpdateHistory] = useCampaignUpdateHistory()
  const [user] = useUser()

  const [value, setValue] = useState()

  const onChangeField = (val) => {
    setValue(val)
  }

  const handleSubmit = async () => {
    let newAddition = parseInt(value, 10)

    setReportedVoterGoals({
      ...reportedVoterGoals,
      [flowType]: (reportedVoterGoals[flowType] || 0) + newAddition,
    })

    const newHistoryItem = await createUpdateHistory({
      type: flowType,
      quantity: newAddition,
    })

    setUpdateHistory([
      ...updateHistoryItems,
      createIrresponsiblyMassagedHistoryItem(newHistoryItem, user),
    ])

    onSubmit(newAddition)
    setValue(0)
  }

  return (
    <div className="">
      {
        <Modal open={true} closeCallback={onClose}>
          <div className="w-[80vw] max-w-[640px] lg:p-6">
            <H1 className="mb-6 text-center">{modalTitle}</H1>
            <TextField
              label={modalLabel}
              onChange={(e) => onChangeField(e.target.value)}
              value={value}
              fullWidth
              type="number"
              min="0"
              required
              autoFocus
            />

            <div className="flex justify-center items-center mt-6">
              <Button
                size="large"
                color="secondary"
                onClick={handleSubmit}
                disabled={value <= 0}
              >
                Save
              </Button>
            </div>
          </div>
        </Modal>
      }
    </div>
  )
}
