'use client'
import { useState, useMemo } from 'react'
import Modal from '@shared/utils/Modal'
import H1 from '@shared/typography/H1'
import TextField from '@shared/inputs/TextField'
import Button from '@shared/buttons/Button'
import { VoterContactModalWrapper } from '../shared/VoterContactModalWrapper'
import { useVoterContacts } from '@shared/hooks/useVoterContacts'
import { useCampaignUpdateHistory } from '@shared/hooks/useCampaignUpdateHistory'
import {
  createIrresponsiblyMassagedHistoryItem,
  createUpdateHistory,
} from '@shared/utils/campaignUpdateHistoryServices'
import { useUser } from '@shared/hooks/useUser'
import { buildTrackingAttrs, EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { analytics } from '@shared/utils/analytics'

const getEditedFields = (formState) =>
  Object.keys(formState).reduce(
    (acc, key) => ({
      ...acc,
      ...(Boolean(formState[key]) ? { [key]: parseInt(formState[key]) } : {}),
    }),
    {},
  )

const calculateIncrementedFields = (currentFields, editedFields) =>
  Object.keys(editedFields).reduce(
    (acc, k) => ({
      ...acc,
      [k]: (currentFields[k] || 0) + editedFields[k],
    }),
    {},
  )

const INITIAL_FORM_STATE = {
  text: '',
  robocall: '',
  doorKnocking: '',
  phoneBanking: '',
  socialMedia: '',
  events: '',
}

export const RecordVoterContactsModal = ({ open = false, setOpen }) => {
  const [user] = useUser()
  const [recordedVoterGoals, setRecordedVoterGoals] = useVoterContacts()
  const [updateHistory, setUpdateHistory] = useCampaignUpdateHistory()
  const [formState, setFormState] = useState(INITIAL_FORM_STATE)

  const trackingAttrs = useMemo(
    () =>
      buildTrackingAttrs('Save Voters Contacted', {
        contactTypes: Object.keys(formState),
        options: formState,
      }),
    [formState],
  )

  const handleInputChange = (field) => (e) => {
    setFormState({
      ...formState,
      [field]: e.target.value,
    })
  }

  const handleSubmit = async () => {
    const updatedFields = getEditedFields(formState)
    const newHistoryItemsData = Object.keys(updatedFields).map((key) => ({
      type: key,
      quantity: updatedFields[key],
    }))
    const newHistoryItems = await Promise.all(
      newHistoryItemsData.map((item) => createUpdateHistory(item)),
    )
    const newContactTotals = calculateIncrementedFields(recordedVoterGoals, updatedFields)

    for (const [medium, recipientCount] of Object.entries(updatedFields)) {
      if (recipientCount.length <= 0 || Number(recipientCount) <= 0) continue
      trackEvent(EVENTS.Dashboard.VoterContact.CampaignCompleted, { 
        recipientCount,
        price: 0,
        medium,
        method: 'unknown',
        campaignName: 'null',
      })
    }

    analytics.identify(user.id, { 
      voterContacts: Object.values({ ...recordedVoterGoals, ...newContactTotals })
      .reduce((sum, val) => sum + Number(val) || 0, 0)
    })

    setRecordedVoterGoals({
      ...recordedVoterGoals,
      ...newContactTotals,
    })
    setUpdateHistory([
      ...updateHistory,
      ...newHistoryItems.map((item) =>
        createIrresponsiblyMassagedHistoryItem(item, user),
      ),
    ])
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
            min="0"
            placeholder="Enter amount"
            value={formState.text}
            onChange={handleInputChange('text')}
          />

          <TextField
            label="Robocalls Sent"
            type="number"
            fullWidth
            min="0"
            placeholder="Enter amount"
            value={formState.robocall}
            onChange={handleInputChange('robocall')}
          />

          <TextField
            label="Doors Knocked"
            type="number"
            fullWidth
            min="0"
            placeholder="Enter amount"
            value={formState.doorKnocking}
            onChange={handleInputChange('doorKnocking')}
          />

          <TextField
            label="Calls Made"
            type="number"
            fullWidth
            min="0"
            placeholder="Enter amount"
            value={formState.phoneBanking}
            onChange={handleInputChange('phoneBanking')}
          />

          <TextField
            label="Social Post Views"
            type="number"
            fullWidth
            min="0"
            placeholder="Enter amount"
            value={formState.socialMedia}
            onChange={handleInputChange('socialMedia')}
          />

          <TextField
            label="Voters Met At Events"
            type="number"
            fullWidth
            min="0"
            placeholder="Enter amount"
            value={formState.events}
            onChange={handleInputChange('events')}
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
