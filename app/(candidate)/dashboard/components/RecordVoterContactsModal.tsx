'use client'
import { useState, useMemo, ChangeEvent } from 'react'
import Modal from '@shared/utils/Modal'
import H1 from '@shared/typography/H1'
import TextField from '@shared/inputs/TextField'
import Button from '@shared/buttons/Button'
import { VoterContactModalWrapper } from '../shared/VoterContactModalWrapper'
import { useVoterContacts } from '@shared/hooks/useVoterContacts'
import { VoterContactsState } from '@shared/hooks/VoterContactsProvider'
import { useCampaignUpdateHistory } from '@shared/hooks/useCampaignUpdateHistory'
import {
  CampaignUpdateHistoryWithUser,
  CampaignUpdateHistoryType,
} from '@shared/hooks/CampaignUpdateHistoryProvider'
import {
  createIrresponsiblyMassagedHistoryItem,
  createUpdateHistory,
} from '@shared/utils/campaignUpdateHistoryServices'
import { useUser } from '@shared/hooks/useUser'
import { buildTrackingAttrs, EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { identifyUser } from '@shared/utils/analytics'

interface FormState {
  text: string
  robocall: string
  doorKnocking: string
  phoneBanking: string
  socialMedia: string
  events: string
}

type FormStateKey = keyof FormState

const FORM_KEY_TO_HISTORY_TYPE: Partial<Record<FormStateKey, CampaignUpdateHistoryType>> = {
  text: 'text',
  robocall: 'robocall',
  doorKnocking: 'doorKnocking',
  phoneBanking: 'phoneBanking',
  socialMedia: 'socialMedia',
  events: 'events',
}

const getEditedFields = (
  formState: FormState,
): Partial<VoterContactsState> => {
  const result: Partial<VoterContactsState> = {}
  const keys: FormStateKey[] = ['text', 'robocall', 'doorKnocking', 'phoneBanking', 'socialMedia', 'events']
  for (const key of keys) {
    if (formState[key]) {
      result[key] = parseInt(formState[key], 10)
    }
  }
  return result
}

const VOTER_CONTACT_KEYS: (keyof VoterContactsState)[] = [
  'doorKnocking',
  'calls',
  'digital',
  'directMail',
  'digitalAds',
  'text',
  'events',
  'robocall',
  'phoneBanking',
  'socialMedia',
]

const calculateIncrementedFields = (
  currentFields: VoterContactsState,
  editedFields: Partial<VoterContactsState>,
): VoterContactsState => {
  const result: VoterContactsState = { ...currentFields }
  for (const key of VOTER_CONTACT_KEYS) {
    const editedValue = editedFields[key]
    if (editedValue !== undefined) {
      result[key] = (currentFields[key] || 0) + editedValue
    }
  }
  return result
}

const INITIAL_FORM_STATE: FormState = {
  text: '',
  robocall: '',
  doorKnocking: '',
  phoneBanking: '',
  socialMedia: '',
  events: '',
}

interface RecordVoterContactsModalProps {
  open?: boolean
  setOpen: (open: boolean) => void
}

export const RecordVoterContactsModal = ({
  open = false,
  setOpen,
}: RecordVoterContactsModalProps): React.JSX.Element => {
  const [user] = useUser()
  const [recordedVoterGoals, setRecordedVoterGoals] = useVoterContacts()
  const [updateHistory, setUpdateHistory] = useCampaignUpdateHistory()
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE)

  const trackingAttrs = useMemo(
    () =>
      buildTrackingAttrs('Save Voters Contacted', {
        contactTypes: Object.keys(formState).join(','),
        formValues: JSON.stringify(formState),
      }),
    [formState],
  )

  const handleInputChange =
    (field: FormStateKey) =>
    (e: ChangeEvent<HTMLInputElement>): void => {
      setFormState({
        ...formState,
        [field]: e.target.value,
      })
    }

  const handleSubmit = async (): Promise<void> => {
    const updatedFields = getEditedFields(formState)
    const historyItemPromises: Promise<CampaignUpdateHistoryWithUser>[] = []

    const keys: FormStateKey[] = ['text', 'robocall', 'doorKnocking', 'phoneBanking', 'socialMedia', 'events']
    for (const key of keys) {
      const value = updatedFields[key]
      const historyType = FORM_KEY_TO_HISTORY_TYPE[key]
      if (value !== undefined && value > 0 && historyType) {
        historyItemPromises.push(
          createUpdateHistory({ type: historyType, quantity: value }).then((item) => {
            if (!user) {
              throw new Error('User is required')
            }
            return createIrresponsiblyMassagedHistoryItem(item, user)
          }),
        )
      }
    }

    const newHistoryItems = await Promise.all(historyItemPromises)
    const newContactTotals = calculateIncrementedFields(recordedVoterGoals, updatedFields)

    for (const key of keys) {
      const recipientCount = updatedFields[key]
      if (recipientCount !== undefined && recipientCount > 0) {
        trackEvent(EVENTS.Dashboard.VoterContact.CampaignCompleted, {
          recipientCount,
          price: 0,
          medium: key,
          method: 'manual',
          campaignName: 'null',
        })
      }
    }

    if (user) {
      const totalContacts = Object.values(newContactTotals).reduce(
        (sum, val) => sum + (val || 0),
        0,
      )
      await identifyUser(user.id, { voterContacts: totalContacts })
    }

    setRecordedVoterGoals(newContactTotals)
    setUpdateHistory([...updateHistory, ...newHistoryItems])
    setFormState({ ...INITIAL_FORM_STATE })
    setOpen(false)
  }

  return (
    <Modal open={open} closeCallback={() => setOpen(false)}>
      <VoterContactModalWrapper>
        <div className="text-center">
          <H1>How many voters did you contact?</H1>
        </div>

        <div className="space-y-4">
          <TextField
            label="Text Messages Sent"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formState.text}
            onChange={handleInputChange('text')}
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Robocalls Sent"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formState.robocall}
            onChange={handleInputChange('robocall')}
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Doors Knocked"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formState.doorKnocking}
            onChange={handleInputChange('doorKnocking')}
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Calls Made"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formState.phoneBanking}
            onChange={handleInputChange('phoneBanking')}
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Social Post Views"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formState.socialMedia}
            onChange={handleInputChange('socialMedia')}
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Voters Met At Events"
            type="number"
            fullWidth
            placeholder="Enter amount"
            value={formState.events}
            onChange={handleInputChange('events')}
            inputProps={{ min: 0 }}
          />
        </div>

        <div className="flex justify-center">
          <Button
            color="secondary"
            size="large"
            onClick={handleSubmit}
            className="px-16"
            {...trackingAttrs}
          >
            Save
          </Button>
        </div>
      </VoterContactModalWrapper>
    </Modal>
  )
}
