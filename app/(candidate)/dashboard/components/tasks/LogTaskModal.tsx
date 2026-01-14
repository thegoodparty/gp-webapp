import { useState, useMemo } from 'react'
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
import { buildTrackingAttrs, EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { identifyUser } from '@shared/utils/analytics'

type LogTaskFlowType = 'text' | 'robocall' | 'doorKnocking' | 'phoneBanking' | 'socialMedia' | 'events'

interface LogTaskModalProps {
  onSubmit: (value: number) => void
  onClose: () => void
  flowType: LogTaskFlowType
}

export const TASK_TYPE_HEADINGS: { [K in LogTaskFlowType]: string } = {
  text: 'How many text messages did you schedule?',
  robocall: 'How many robocalls did you schedule?',
  doorKnocking: 'How many doors did you knock?',
  phoneBanking: 'How many calls did you make?',
  socialMedia: 'How many views did your post get?',
  events: 'How many voters did you meet?',
}

export const TASK_TYPE_LABELS: { [K in LogTaskFlowType]: string } = {
  text: 'Text Messages Scheduled',
  robocall: 'Robocalls Scheduled',
  doorKnocking: 'Doors Knocked',
  phoneBanking: 'Calls Made',
  socialMedia: 'Social Post Views',
  events: 'Voters Met',
}

export default function LogTaskModal({ onSubmit, onClose, flowType }: LogTaskModalProps) {
  const modalTitle = TASK_TYPE_HEADINGS[flowType]
  const modalLabel = TASK_TYPE_LABELS[flowType]
  const [reportedVoterGoals, setReportedVoterGoals] = useVoterContacts()
  const [updateHistoryItems, setUpdateHistory] = useCampaignUpdateHistory()
  const [user] = useUser()
  const [value, setValue] = useState<string>()

  const trackingAttrs = useMemo(
    () => buildTrackingAttrs('Log Task Contacts', { type: flowType, value: value || '' }),
    [flowType, value],
  )

  const onChangeField = (val: string) => {
    setValue(val)
  }

  const handleSubmit = async () => {
    let newAddition = parseInt(value || '0', 10)

    const nextGoals = {
      ...reportedVoterGoals,
      [flowType]: (reportedVoterGoals[flowType] || 0) + newAddition,
    }

    setReportedVoterGoals(nextGoals)

    trackEvent(EVENTS.Dashboard.VoterContact.CampaignCompleted, {
      recipientCount: newAddition,
      price: 0,
      medium: flowType,
      method: 'unknown',
      campaignName: 'null',
    })
    await identifyUser(user?.id, {
      voterContacts: Object.values(nextGoals).reduce(
        (sum, v) => sum + (Number(v) || 0),
        0,
      ),
    })

    const newHistoryItem = await createUpdateHistory({
      type: flowType,
      quantity: newAddition,
    })

    if (!user) {
      throw new Error('User is required')
    }
    setUpdateHistory([
      ...updateHistoryItems,
      createIrresponsiblyMassagedHistoryItem(newHistoryItem, user),
    ])

    onSubmit(newAddition)
    setValue('0')
  }

  return (
    <div className="">
      {
        <Modal open={true} closeCallback={onClose}>
          <div className="max-w-[500px] lg:p-6">
            <H1 className="mb-6 text-center">{modalTitle}</H1>
            <TextField
              label={modalLabel}
              onChange={(e) => onChangeField(e.target.value)}
              value={value}
              fullWidth
              type="number"
              inputProps={{ min: 0 }}
              required
              autoFocus
            />

            <div className="flex justify-center items-center mt-6">
              <Button
                size="large"
                color="secondary"
                onClick={handleSubmit}
                disabled={Number(value) <= 0}
                {...trackingAttrs}
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
