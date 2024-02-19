'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { Fragment, useState } from 'react';
import {
  onboardingStep,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import contentfulHelper from 'helpers/contentfulHelper';
import { Checkbox } from '@mui/material';
import H1 from '@shared/typography/H1';
import { FaFlagUsa, FaPeopleGroup } from 'react-icons/fa6';
import { FaLightbulb } from 'react-icons/fa';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { FcDocument } from 'react-icons/fc';
import { IoDocumentText } from 'react-icons/io5';

async function launchCampaign() {
  try {
    const api = gpApi.campaign.onboarding.launch;
    // const payload = {
    //   slug,
    // };
    return await gpFetch(api);
  } catch (e) {
    console.log('error at launchCampaign', e);
    return {};
  }
}

export default function PledgeStep({ campaign, pledge, step }) {
  console.log('campaign', campaign);
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

  if (!pledge) {
    return null;
  }

  const canSave = () => {
    return state.pledged1 && state.pledged2 && state.pledged3 && state.pledged4;
  };

  const handleSave = async () => {
    const updated = campaign;

    updated.details.pledged =
      state.pledged1 && state.pledged2 && state.pledged3 && state.pledged4;
    updated.currentStep = onboardingStep(campaign, step);
    await updateCampaign(updated);
    await launchCampaign();
    window.location.href = '/dashboard/plan';
  };

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const steps = ['1', '2', '3', '4'];

  return (
    <div>
      <H1 className="py-10 text-center">Good Party User Agreement</H1>
      {steps.map((step, index) => (
        <Fragment key={step}>
          <div className="bg-gray-200 p-4 font-bold rounded mb-6 flex justify-between items-center">
            <div className="flex items-center">
              {step === '1' && <FaFlagUsa className="mr-2" />}
              {step === '2' && <FaPeopleGroup className="mr-2" />}
              {step === '3' && <FaLightbulb className="mr-2" />}
              {step === '4' && <IoDocumentText className="mr-2" />}
              <div>{pledge[`title${step}`]}</div>
            </div>
            <div className="">
              I agree &nbsp; &nbsp;
              <Checkbox
                checked={state[`pledged${step}`]}
                onChange={(e) =>
                  onChangeField(`pledged${step}`, e.target.checked)
                }
              />
            </div>
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
                    and acknowledge that Good Party maintains the right to
                    withdraw its Good Party Certified endorsement and remove me
                    from the site if I actively engage in such conduct.
                  </li>
                  <li>
                    I agree to the Good Party{' '}
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
                    I acknowledge Good Party maintains the right to remove users
                    from the platform and withdraw its Good Party certification
                    and endorsement if users engage in conduct that violates
                    these terms of service.
                  </li>
                </ul>
              )}
            </CmsContentWrapper>
          </div>
        </Fragment>
      ))}

      <div className="flex justify-center mb-8">
        <BlackButtonClient onClick={handleSave} disabled={!canSave()}>
          <div className="font-black">FINISH</div>
        </BlackButtonClient>
      </div>
    </div>
  );
}
