import { InputLabel, MenuItem, Select } from '@mui/material'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import Body2 from '@shared/typography/Body2'
import H1 from '@shared/typography/H1'
import Modal from '@shared/utils/Modal'
import { useState } from 'react'
import CustomVoterAudience from './CustomVoterAudience'
import Button from '@shared/buttons/Button'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { TRACKING_KEYS } from './CustomVoterAudienceFilters'

const fields = [
  {
    id: 'channel',
    label: 'Channel *',
    options: ['Direct Mail', 'Door Knocking', 'Texting', 'Phone Banking'],
    onSelect: (channel) =>
      trackEvent(EVENTS.VoterData.CustomFile.SelectChannel, {
        channel,
      }),
  },
  {
    id: 'purpose',
    label: 'Purpose',
    options: ['GOTV', 'Persuasion', 'Voter ID'],
    onSelect: (purpose) =>
      trackEvent(EVENTS.VoterData.CustomFile.SelectPurpose, {
        purpose,
      }),
  },
]

export default function CustomVoterFile({
  campaign,
  reloadCampaignCallback,
  buttonPosition,
}) {
  const [open, setOpen] = useState(false)
  const [showAudience, setShowAudience] = useState(false)

  const [state, setState] = useState({
    channel: '',
    purpose: '',
  })

  const handleChange = (key, value) => {
    setState({
      ...state,
      [key]: value,
    })
  }

  const canSave = () => {
    return state.channel !== ''
  }

  const customCreatedCallback = async () => {
    await reloadCampaignCallback()
    setOpen(false)
    setShowAudience(false)
    setState({
      channel: '',
      purpose: '',
    })
  }

  const handleClose = () => {
    trackEvent(EVENTS.VoterData.CustomFile.Exit)
    setOpen(false)
    setShowAudience(false)
    setState({
      channel: '',
      purpose: '',
    })
  }

  return (
    <>
      <Button
        size="large"
        className="w-full md:w-auto"
        onClick={() => {
          trackEvent(EVENTS.VoterData.ClickCreateCustom, {
            position: buttonPosition,
          })
          setOpen(true)
        }}
      >
        Create a custom voter file
      </Button>

      <Modal closeCallback={handleClose} open={open}>
        {!showAudience ? (
          <div className="w-[80vw] max-w-xl p-2 md:p-8">
            <div>
              <div className=" text-center">
                <H1 className="mb-4">Voter File Assistant</H1>
                <Body2>How would you like to use this voter file?</Body2>
              </div>
              <div className="mt-8 grid grid-cols-12 gap-4">
                {fields.map((field) => (
                  <div key={field.id} className="col-span-12">
                    <InputLabel id={field.id}>{field.label}</InputLabel>
                    <Select
                      fullWidth
                      placeholder="Select a purpose"
                      labelId={field.id}
                      value={state[field.id]}
                      label={field.label}
                      displayEmpty
                      required
                      onChange={(e) => {
                        field.onSelect(e.target.value)
                        handleChange(field.id, e.target.value)
                      }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {field.options.map((option) => (
                        <MenuItem value={option} key={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-400 text-center mt-1">
                When you select a purpose, GoodParty.org recommends filters for
                you.
              </div>
              <div className="flex justify-between mt-12">
                <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
                <PrimaryButton
                  disabled={!canSave()}
                  onClick={() => {
                    trackEvent(EVENTS.VoterData.CustomFile.ClickNext)
                    setShowAudience(true)
                  }}
                >
                  Next
                </PrimaryButton>
              </div>
            </div>
          </div>
        ) : (
          <CustomVoterAudience
            trackingKey={TRACKING_KEYS.customVoterFile}
            campaign={campaign}
            backCallback={() => {
              trackEvent(EVENTS.VoterData.CustomFile.Audience.ClickBack)
              setShowAudience(false)
            }}
            prevStepValues={state}
            customCreatedCallback={customCreatedCallback}
          />
        )}
      </Modal>
    </>
  )
}
