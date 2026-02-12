'use client'

import H3 from '@shared/typography/H3'
import { useEffect, useState } from 'react'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import {
  campaignOfficeFields,
  OfficeFieldState,
} from 'helpers/campaignOfficeFields'
import { CampaignOfficeInputFields } from 'app/(candidate)/dashboard/shared/CampaignOfficeInputFields'
import { CampaignOfficeSelectionModal } from 'app/(candidate)/dashboard/shared/CampaignOfficeSelectionModal'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { Campaign } from 'helpers/types'

interface OfficeSectionProps {
  campaign?: Campaign
}

const OfficeSection = (props: OfficeSectionProps): React.JSX.Element => {
  const initialState: OfficeFieldState = {
    office: '',
    state: '',
    electionDate: '',
    primaryElectionDate: '',
    officeTermLength: '',
  }
  const [state, setState] = useState<OfficeFieldState>(initialState)
  const [showModal, setShowModal] = useState(false)
  const [campaign, setCampaign] = useState<Campaign | undefined>(props.campaign)

  useEffect(() => {
    if (campaign?.details) {
      const details = campaign.details
      setState(
        campaignOfficeFields({
          office: details.office,
          otherOffice: details.otherOffice,
          state: details.state,
          electionDate: details.electionDate,
          primaryElectionDate: details.primaryElectionDate,
          officeTermLength: details.officeTermLength,
        }),
      )
    }
  }, [campaign])

  const handleEdit = () => {
    trackEvent(EVENTS.Profile.OfficeDetails.ClickEdit)
    setShowModal(true)
  }

  const handleUpdate = async () => {
    trackEvent(EVENTS.Profile.OfficeDetails.ClickSave)
    const updatedCampaign = await getCampaign()
    if (updatedCampaign) {
      setCampaign(updatedCampaign)
    }
    setShowModal(false)
  }

  return (
    <section className="border-t pt-6 border-gray-600">
      <H3 className="pb-6">Office Details</H3>

      <div className="grid grid-cols-12 gap-3">
        <CampaignOfficeInputFields values={state} />
      </div>
      <div className="flex justify-end mb-6 mt-2">
        <PrimaryButton onClick={handleEdit}>Edit Office Details</PrimaryButton>
      </div>
      <CampaignOfficeSelectionModal
        campaign={campaign}
        show={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleUpdate}
      />
    </section>
  )
}

export default OfficeSection
