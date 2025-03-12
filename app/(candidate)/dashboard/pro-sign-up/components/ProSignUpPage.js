'use client';
import { FocusedExperienceWrapper } from 'app/(candidate)/dashboard/shared/FocusedExperienceWrapper';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import { campaignOfficeFields } from 'helpers/campaignOfficeFields';
import { useState } from 'react';
import { CampaignOfficeInputFields } from 'app/(candidate)/dashboard/shared/CampaignOfficeInputFields';
import { CampaignOfficeSelectionModal } from 'app/(candidate)/dashboard/shared/CampaignOfficeSelectionModal';
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { AlreadyProUserPrompt } from 'app/(candidate)/dashboard/shared/AlreadyProUserPrompt';
import Button from '@shared/buttons/Button';
import { EVENTS, trackEvent } from 'helpers/fullStoryHelper';

const ProSignUpPage = ({ campaign }) => {
  const [campaignState, setCampaignState] = useState(campaign);
  const [showModal, setShowModal] = useState(false);
  const officeFields = campaignOfficeFields(campaignState?.details);

  const onSelect = async () => {
    trackEvent(EVENTS.ProUpgrade.SubmitEditOffice);
    const campaign = await getCampaign();
    setCampaignState(campaign);
    setShowModal(false);
  };

  const onClose = () => {
    trackEvent(EVENTS.ProUpgrade.ExitEditOffice);
    setShowModal(false);
  };

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
          <Button
            className="mb-8 w-full"
            variant="outlined"
            size="large"
            onClick={() => {
              trackEvent(EVENTS.ProUpgrade.EditOffice);
              setShowModal(true);
            }}
          >
            Edit Office
          </Button>
          <Button
            href="/dashboard/pro-sign-up/committee-check"
            onClick={() => {
              trackEvent(EVENTS.ProUpgrade.ConfirmOffice);
            }}
            className="w-full"
            size="large"
          >
            Confirm
          </Button>
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
