import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@styleguide'
import Body2 from '@shared/typography/Body2'
import H1 from '@shared/typography/H1'
import Modal from '@shared/utils/Modal'
import { useState } from 'react'
import CustomVoterAudience from './CustomVoterAudience'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { TRACKING_KEYS } from './CustomVoterAudienceFilters'
import { Campaign } from 'helpers/types'

interface PrevStepValues {
  channel: string
  purpose: string
}

interface Field {
  id: keyof PrevStepValues
  label: string
  options: string[]
  onSelect: (value: string) => void
}

const fields: Field[] = [
  {
    id: 'channel',
    label: 'Channel *',
    options: ['Direct Mail', 'Door Knocking', 'Texting', 'Phone Banking'],
    onSelect: (channel: string) =>
      trackEvent(EVENTS.VoterData.CustomFile.SelectChannel, {
        channel,
      }),
  },
  {
    id: 'purpose',
    label: 'Purpose',
    options: ['GOTV', 'Persuasion', 'Voter ID'],
    onSelect: (purpose: string) =>
      trackEvent(EVENTS.VoterData.CustomFile.SelectPurpose, {
        purpose,
      }),
  },
]

interface CustomVoterFileProps {
  campaign: Campaign
  reloadCampaignCallback: () => Promise<void>
  buttonPosition: 'top' | 'bottom'
}

const CustomVoterFile = ({
  campaign,
  reloadCampaignCallback,
  buttonPosition,
}: CustomVoterFileProps): React.JSX.Element => {
  const [open, setOpen] = useState(false)
  const [showAudience, setShowAudience] = useState(false)

  const [state, setState] = useState<PrevStepValues>({
    channel: '',
    purpose: '',
  })

  const handleChange = (key: keyof PrevStepValues, value: string) => {
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
                    <Label htmlFor={field.id} className="mb-1 block">
                      {field.label}
                    </Label>
                    <Select
                      value={state[field.id]}
                      required
                      onValueChange={(value) => {
                        field.onSelect(value)
                        handleChange(field.id, value)
                      }}
                    >
                      <SelectTrigger id={field.id} className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem value={option} key={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-400 text-center mt-1">
                When you select a purpose, GoodParty.org recommends filters for
                you.
              </div>
              <div className="flex justify-between mt-12">
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  disabled={!canSave()}
                  onClick={() => {
                    trackEvent(EVENTS.VoterData.CustomFile.ClickNext)
                    setShowAudience(true)
                  }}
                >
                  Next
                </Button>
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

export default CustomVoterFile
