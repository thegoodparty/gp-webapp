'use client';
import { FocusedExperienceWrapper } from 'app/(candidate)/dashboard/shared/FocusedExperienceWrapper';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Link from 'next/link';
import { campaignOfficeFields } from 'helpers/campaignOfficeFields';
import { useState } from 'react';
import { CampaignOfficeInputFields } from 'app/(candidate)/dashboard/shared/CampaignOfficeInputFields';
import { CampaignOfficeSelectionModal } from 'app/(candidate)/dashboard/shared/CampaignOfficeSelectionModal';
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { AlreadyProUserPrompt } from 'app/(candidate)/dashboard/shared/AlreadyProUserPrompt';

const ProSignUpPage = ({ campaign }) => {
  const [campaignState, setCampaignState] = useState(campaign);
  const [showModal, setShowModal] = useState(false);
  const officeFields = campaignOfficeFields(campaignState?.details);

  const onSelect = async () => {
    const res = await getCampaign();
    setCampaignState(res.campaign);
    setShowModal(false);
  };

  const onClose = () => setShowModal(false);

  return (
    <FocusedExperienceWrapper>
      {campaign.isPro ? (
        <AlreadyProUserPrompt />
      ) : (
        <>
          <H1 className="mb-4 text-center">
            Please confirm your office details.
          </H1>
          <Body2 className="text-center mb-8">
            We need to verify your info to give you access to GoodParty.org Pro.
          </Body2>
          <CampaignOfficeInputFields values={officeFields} gridLayout={false} />
          <PrimaryButton
            className="mb-8"
            fullWidth
            variant="outlined"
            onClick={() => setShowModal(true)}
          >
            Edit Office
          </PrimaryButton>
          <Link href="/dashboard/pro-sign-up/committee-check">
            <PrimaryButton fullWidth>Confirm</PrimaryButton>
          </Link>
          <CampaignOfficeSelectionModal
            campaign={campaignState}
            show={showModal}
            onClose={onClose}
            onSelect={onSelect}
          />
        </>
      )}
    </FocusedExperienceWrapper>
  );
};

export default ProSignUpPage;
