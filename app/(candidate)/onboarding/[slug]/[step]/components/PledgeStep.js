'use client';
import { Fragment, useState } from 'react';
import {
  onboardingStep,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import contentfulHelper from 'helpers/contentfulHelper';
import H1 from '@shared/typography/H1';
import { FaFlagUsa, FaPeopleGroup } from 'react-icons/fa6';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { IoDocumentText } from 'react-icons/io5';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { FaCheck, FaChild } from 'react-icons/fa';
import SuccessButton from '@shared/buttons/SuccessButton';
import Body1 from '@shared/typography/Body1';
import InfoButton from '@shared/buttons/InfoButton';

async function launchCampaign() {
  try {
    const api = gpApi.campaign.launch;
    return await gpFetch(api);
  } catch (e) {
    console.log('error at launchCampaign', e);
    return false;
  }
}

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

  if (!pledge) {
    return null;
  }

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

  const steps = ['1', '2', '3', '4'];

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
        <Fragment key={step}>
          <div className="bg-gray-200 p-4 font-bold rounded mb-6 flex  items-center">
            {step === '1' && <FaChild className="mr-2" />}
            {step === '2' && <FaPeopleGroup className="mr-2" />}
            {step === '3' && <FaFlagUsa className="mr-2" />}
            {step === '4' && <IoDocumentText className="mr-2" />}
            <div>{pledge[`title${step}`]}</div>
          </div>
          <div
            className={`px-6 pb-10 ${
              step === '1' || state[`pledged${index}`] ? 'block' : 'hidden'
            }`}
          >
            <CmsContentWrapper>
              {contentfulHelper(pledge[`content${step}`])}
              {index === 3 && (
                <ul>
                  <li>
                    I will abide by a{' '}
                    <a
                      className="underline"
                      href="/faqs/what-is-good-partys-minimum-standard-of-civility/66i4vrrlkx1yf8mncqvysb"
                      target="_blank"
                    >
                      minimum standard of civility
                    </a>{' '}
                    and acknowledge that GoodParty.org maintains the right to
                    withdraw its GoodParty.org Certified endorsement and remove
                    me from the site if I actively engage in such conduct.
                  </li>
                  <li>
                    I agree to the GoodParty.org{' '}
                    <a className="underline" href="/privacy" target="_blank">
                      privacy policy
                    </a>{' '}
                    and{' '}
                    <a
                      className="underline"
                      href="/faqs/terms-of-service/2rnff8oqgd3ogf9y1cvnxg"
                      target="_blank"
                    >
                      terms of service
                    </a>
                  </li>
                  <li>
                    I acknowledge GoodParty.org maintains the right to remove
                    users from the platform and withdraw its GoodParty.org
                    certification and endorsement if users engage in conduct
                    that violates these terms of service.
                  </li>
                </ul>
              )}
            </CmsContentWrapper>

            <div className=" flex justify-center mt-8">
              {state[`pledged${step}`] ? (
                <div
                  onClick={() => {
                    onChangeField(`pledged${step}`, false);
                  }}
                >
                  <SuccessButton>
                    <div className="flex items-center">
                      <FaCheck /> <div className="ml-2">Agreed</div>
                    </div>
                  </SuccessButton>
                </div>
              ) : (
                <div
                  onClick={() => {
                    onChangeField(`pledged${step}`, true);
                  }}
                >
                  <PrimaryButton>I Agree</PrimaryButton>
                </div>
              )}
            </div>
          </div>
        </Fragment>
      ))}
      <div className="flex justify-center pt-10 mb-4  border-t border-primary">
        <Body1>I understand I am legally bound to this user agreement. </Body1>
      </div>
      <div className="flex justify-center mb-10">
        <div onClick={openChat} className="mr-4">
          <InfoButton>Ask a question</InfoButton>
        </div>
        <div onClick={handleSave}>
          <PrimaryButton disabled={!canSave()} loading={loading}>
            Submit
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
