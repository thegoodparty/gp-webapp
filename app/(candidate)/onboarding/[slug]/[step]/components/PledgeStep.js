'use client';
import { useEffect, useState } from 'react';
import {
  onboardingStep,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import contentfulHelper from 'helpers/contentfulHelper';
import H1 from '@shared/typography/H1';
import { FaFlagUsa, FaPeopleGroup } from 'react-icons/fa6';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { IoDocumentText } from 'react-icons/io5';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { FaChild } from 'react-icons/fa';
import { FaChild } from 'react-icons/fa';
import Body1 from '@shared/typography/Body1';
import InfoButton from '@shared/buttons/InfoButton';
import { AcknowledgementQuestion } from '@shared/acknowledgements/AcknowledgementQuestion';
import { LegalStatements } from 'app/(candidate)/onboarding/[slug]/[step]/components/LegalStatements';
import { useHubSpotConversations } from '@shared/hooks/useHubSpotConversations';

async function launchCampaign() {
  try {
    const api = gpApi.campaign.launch;
    return await gpFetch(api);
  } catch (e) {
    console.log('error at launchCampaign', e);
    return false;
  }
}

const steps = ['1', '2', '3', '4'];
const emoticons = [
  <FaChild key="1" className="mr-2" />,
  <FaPeopleGroup key="2" className="mr-2" />,
  <FaFlagUsa key="3" className="mr-2" />,
  <IoDocumentText key="4" className="mr-2" />,
];

const steps = ['1', '2', '3', '4'];
const emoticons = [
  <FaChild key="1" className="mr-2" />,
  <FaPeopleGroup key="2" className="mr-2" />,
  <FaFlagUsa key="3" className="mr-2" />,
  <IoDocumentText key="4" className="mr-2" />,
];

export default function PledgeStep({ campaign, pledge, step }) {
  let initialState = {
    pledged1: campaign.details?.pledged1 || false,
    pledged2: campaign.details?.pledged2 || false,
    pledged3: campaign.details?.pledged3 || false,
    pledged4: campaign.details?.pledged4 || false,
  };

  if (campaign?.details?.pledged) {
    initialState = {
      pledged: true,
      pledged1: true,
      pledged2: true,
      pledged3: true,
      pledged4: true,
    };
  }
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { widgetLoaded: hubSpotWidgetLoaded } = useHubSpotConversations();

  if (!pledge) {
    return null;
  }

  const pledgeContents = steps.map((step) =>
    contentfulHelper(pledge[`content${step}`]),
  );

  const pledgeContents = steps.map((step) =>
    contentfulHelper(pledge[`content${step}`]),
  );

  const canSave = () => {
    return (
      !loading &&
      state.pledged1 &&
      state.pledged2 &&
      state.pledged3 &&
      state.pledged4
    );
  };

  const handleSave = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const currentStep = onboardingStep(campaign, step);
    const pledged =
      state.pledged1 && state.pledged2 && state.pledged3 && state.pledged4;
    const attr = [
      { key: 'data.currentStep', value: currentStep },
      { key: 'details.pledged', value: pledged },
    ];

    await updateCampaign(attr);
    const res = await launchCampaign();
    if (res) {
      window.location.href = '/dashboard/plan';
    }
  };

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const openChat = () => {
    window.HubSpotConversations?.widget?.open();
  };

  return (
    <div>
      <H1 className="py-10 text-center">GoodParty.org User Agreement</H1>
      <Body1 className="text-center mb-10">
        I order to use GoodParty.org tools you must Accept each part of our user
        agreement confirming that you will run an Independent, People Powered,
        Anti-corruption campaign that adheres to our terms of service.
      </Body1>
      {steps.map((step, index) => (
        <AcknowledgementQuestion
          key={step}
          {...{
            title: pledge[`title${step}`],
            body:
              index !== 3 ? (
                pledgeContents[index]
              ) : (
                <>
                  {pledgeContents[index]}
                  <LegalStatements />
                </>
              ),
            show: step === '1' || state[`pledged${index}`],
            acknowledged: state[`pledged${step}`],
            onAcknowledge: (value) => {
              onChangeField(`pledged${step}`, value);
            },
            buttonTexts: ['I Agree', 'Agreed'],
            emoticon: emoticons[index],
          }}
        />
      ))}
      <div className="flex justify-center pt-10 mb-4  border-t border-primary">
        <Body1>I understand I am legally bound to this user agreement. </Body1>
      </div>
      <div className="flex justify-center mb-10">
        {hubSpotWidgetLoaded && (
          <div onClick={openChat} className="mr-4">
            <InfoButton>Ask a question</InfoButton>
          </div>
        )}
        <div onClick={handleSave}>
          <PrimaryButton disabled={!canSave()} loading={loading}>
            Submit
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
