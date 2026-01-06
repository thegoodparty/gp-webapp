import PrimaryButton from '@shared/buttons/PrimaryButton'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import Body2 from '@shared/typography/Body2'
import H1 from '@shared/typography/H1'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { dateUsHelper } from 'helpers/dateHelper'
import {
  buildTrackingAttrs,
  trackEvent,
  EVENTS,
} from 'helpers/analyticsHelper'

import { useState } from 'react'
import CustomVoterAudienceFilters, { AudienceFiltersState } from './CustomVoterAudienceFilters'
import { Campaign, CustomVoterFile } from 'helpers/types'

interface PrevStepValues {
  channel: string
  purpose: string
}

interface CustomVoterAudienceProps {
  campaign: Campaign
  backCallback: () => void
  customCreatedCallback: () => Promise<void>
  prevStepValues: PrevStepValues
  trackingKey?: string
}

const CustomVoterAudience = ({
  campaign,
  backCallback,
  customCreatedCallback,
  prevStepValues,
}: CustomVoterAudienceProps): React.JSX.Element => {
  const [state, setState] = useState<AudienceFiltersState>({})
  const [loading, setLoading] = useState(false)

  const handleChangeAudience = (newState: AudienceFiltersState) => {
    setState(newState)
  }

  const { office, otherOffice } = campaign?.details || {}
  const resolvedOffice = office === 'Other' ? otherOffice : office

  const canSave = () => {
    return !loading && Object.values(state).some((v) => v)
  }
  const handleSubmit = async () => {
    trackEvent(EVENTS.VoterData.CustomFile.ClickCreate)

    setLoading(true)

    const selectedAudience = Object.entries(state)
      .filter(([, value]) => value)
      .map(([key]) => key)
    const voterFiles: CustomVoterFile[] = campaign.data?.customVoterFiles || []
    const newFile: CustomVoterFile = {
      filters: selectedAudience,
      channel: prevStepValues.channel,
      name: `${prevStepValues.channel} ${
        prevStepValues.purpose !== '' ? ` - ${prevStepValues.purpose}` : ''
      } - ${dateUsHelper(new Date())}`,
    }
    if (prevStepValues.purpose) {
      newFile.purpose = prevStepValues.purpose
    }

    voterFiles.push(newFile)
    await updateCampaign([
      {
        key: 'data.customVoterFiles',
        value: voterFiles,
      },
    ])
    trackEvent('Custom Voter file created', { newFileName: newFile.name })
    await customCreatedCallback()
    setState({})
    setLoading(false)
  }

  const trackingAttrs = buildTrackingAttrs('Create Custom Voter File Button')

  return (
    <div className="w-[90vw] max-w-5xl p-2 md:p-8">
      <div className=" text-center mb-8">
        <H1 className="mb-2">Select Your Filters</H1>
        <Body2>
          Make your selections to get custom election data for:{' '}
          <span className=" font-bold">{resolvedOffice}</span>.<br />
          You must make a minimum of one selection.
        </Body2>
      </div>
      <CustomVoterAudienceFilters
        prevStepValues={prevStepValues}
        onChangeCallback={handleChangeAudience}
      />

      <div className="flex justify-between mt-12">
        <SecondaryButton onClick={backCallback}>Back</SecondaryButton>
        <PrimaryButton
          disabled={!canSave()}
          onClick={handleSubmit}
          {...trackingAttrs}
        >
          Create Voter File
        </PrimaryButton>
      </div>
    </div>
  )
}

export default CustomVoterAudience
