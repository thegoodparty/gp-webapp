'use client'
import { useState, useMemo, ChangeEvent } from 'react'
import { Input } from '@styleguide/components/ui/input'
import { Label } from '@styleguide/components/ui/label'
import { Button } from '@styleguide/components/ui/button'
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
import { ModalOrDrawer } from '@shared/ui/ModalOrDrawer'

interface FormState {
  text: string
  robocall: string
  doorKnocking: string
  phoneBanking: string
  socialMedia: string
  events: string
}

type FormStateKey = keyof FormState

const FORM_KEYS: FormStateKey[] = [
  'text',
  'robocall',
  'doorKnocking',
  'phoneBanking',
  'socialMedia',
  'events',
]

const FORM_KEY_TO_HISTORY_TYPE: Partial<
  Record<FormStateKey, CampaignUpdateHistoryType>
> = {
  text: 'text',
  robocall: 'robocall',
  doorKnocking: 'doorKnocking',
  phoneBanking: 'phoneBanking',
  socialMedia: 'socialMedia',
  events: 'events',
}

const getEditedFields = (formState: FormState): Partial<VoterContactsState> => {
  const result: Partial<VoterContactsState> = {}
  for (const key of FORM_KEYS) {
    if (formState[key] !== '') {
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

  const hasInput = Object.values(formState).some(
    (v) => v !== '' && Number(v) > 0,
  )

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
      setFormState((prev) => ({
        ...prev,
        [field]: e.target.value,
      }))
    }

  const handleSubmit = async (): Promise<void> => {
    const updatedFields = getEditedFields(formState)
    const historyItemPromises: Promise<CampaignUpdateHistoryWithUser>[] = []

    for (const key of FORM_KEYS) {
      const value = updatedFields[key]
      const historyType = FORM_KEY_TO_HISTORY_TYPE[key]
      if (value !== undefined && value > 0 && historyType) {
        historyItemPromises.push(
          createUpdateHistory({ type: historyType, quantity: value }).then(
            (item) => {
              if (!user) {
                throw new Error('User is required')
              }
              return createIrresponsiblyMassagedHistoryItem(item, user)
            },
          ),
        )
      }
    }

    const newHistoryItems = await Promise.all(historyItemPromises)
    const newContactTotals = calculateIncrementedFields(
      recordedVoterGoals,
      updatedFields,
    )

    for (const key of FORM_KEYS) {
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
      const totalContacts = Object.values(newContactTotals).reduce<number>(
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
    <ModalOrDrawer
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setOpen(false)
        }
      }}
      title="How many voters did you contact?"
    >
      <div className="p-4 md:p-2">
        <div className="text-lg font-semibold mb-8">
          How many voters did you contact?
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="text">Text Messages Sent</Label>
            <Input
              id="text"
              type="number"
              placeholder="Enter amount"
              min={0}
              value={formState.text}
              onChange={handleInputChange('text')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="robocall">Robocalls Sent</Label>
            <Input
              id="robocall"
              type="number"
              placeholder="Enter amount"
              min={0}
              value={formState.robocall}
              onChange={handleInputChange('robocall')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doorKnocking">Doors Knocked</Label>
            <Input
              id="doorKnocking"
              type="number"
              placeholder="Enter amount"
              min={0}
              value={formState.doorKnocking}
              onChange={handleInputChange('doorKnocking')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phoneBanking">Calls Made</Label>
            <Input
              id="phoneBanking"
              type="number"
              placeholder="Enter amount"
              min={0}
              value={formState.phoneBanking}
              onChange={handleInputChange('phoneBanking')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="socialMedia">Social Post Views</Label>
            <Input
              id="socialMedia"
              type="number"
              placeholder="Enter amount"
              min={0}
              value={formState.socialMedia}
              onChange={handleInputChange('socialMedia')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="events">Voters Met At Events</Label>
            <Input
              id="events"
              type="number"
              placeholder="Enter amount"
              min={0}
              value={formState.events}
              onChange={handleInputChange('events')}
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button
            size="large"
            onClick={handleSubmit}
            disabled={!hasInput}
            className="px-16"
            {...trackingAttrs}
          >
            Save
          </Button>
        </div>
      </div>
    </ModalOrDrawer>
  )
}
