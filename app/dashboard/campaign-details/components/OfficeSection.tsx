'use client'

import H3 from '@shared/typography/H3'
import { useEffect, useState } from 'react'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { getCampaign } from 'app/onboarding/shared/ajaxActions'
import { OfficeFieldState } from 'helpers/campaignOfficeFields'
import { CampaignOfficeInputFields } from 'app/dashboard/shared/CampaignOfficeInputFields'
import { CampaignOfficeSelectionModal } from 'app/dashboard/shared/CampaignOfficeSelectionModal'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { Campaign } from 'helpers/types'
import {
  ORGANIZATIONS_QUERY_KEY,
  useOrganization,
} from '@shared/organization-picker'
import { usePositionName } from '@shared/hooks/usePositionName'
import { queryClient } from '@shared/query-client'

interface OfficeSectionProps {
  campaign?: Campaign
}

const OfficeSection = (props: OfficeSectionProps): React.JSX.Element => {
  const organization = useOrganization()
  const positionName = usePositionName()
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
    setCampaign(props.campaign)
  }, [props.campaign])

  useEffect(() => {
    if (campaign?.details) {
      const details = campaign.details
      setState({
        office: positionName,
        state: details.state || '',
        electionDate: details.electionDate || '',
        primaryElectionDate: details.primaryElectionDate || '',
        officeTermLength: details.officeTermLength || '',
      })
    } else if (organization) {
      setState({
        office: positionName,
        state: organization.position?.state || '',
        electionDate: '',
        primaryElectionDate: '',
        officeTermLength: '',
      })
    }
  }, [campaign, positionName, organization])

  const handleEdit = () => {
    trackEvent(EVENTS.Profile.OfficeDetails.ClickEdit)
    setShowModal(true)
  }

  const handleUpdate = async () => {
    trackEvent(EVENTS.Profile.OfficeDetails.ClickSave)
    if (campaign) {
      const updatedCampaign = await getCampaign()
      if (updatedCampaign) {
        setCampaign(updatedCampaign)
      }
    } else {
      await queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_QUERY_KEY })
    }
    setShowModal(false)
  }

  return (
    <section
      className={
        organization?.electedOfficeId ? 'pt-6' : 'border-t pt-6 border-gray-600'
      }
    >
      <H3 className="pb-6">Office Details</H3>

      <div className="grid grid-cols-12 gap-3">
        <CampaignOfficeInputFields
          values={state}
          hiddenFields={
            organization?.electedOfficeId
              ? ['electionDate', 'primaryElectionDate', 'officeTermLength']
              : []
          }
        />
      </div>
      <div className="flex justify-end mb-6 mt-2">
        <PrimaryButton onClick={handleEdit}>Edit Office Details</PrimaryButton>
      </div>
      <CampaignOfficeSelectionModal
        campaign={campaign}
        show={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleUpdate}
        organizationSlug={organization?.slug}
      />
    </section>
  )
}

export default OfficeSection
