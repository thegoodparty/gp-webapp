'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import H1 from '@shared/typography/H1';
import {
  onboardingStep,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useRouter } from 'next/navigation';
import BallotRaces from './ballotOffices/BallotRaces';
import { useState, useMemo } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { buildTrackingAttrs } from 'helpers/fullStoryHelper';
import Button from '@shared/buttons/Button';

async function runP2V(slug) {
  try {
    const api = gpApi.voterData.pathToVictory;
    const payload = { slug };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function OfficeStep(props) {
  const { campaign, step, updateCallback, adminMode } = props;
  const router = useRouter();
  const [state, setState] = useState({
    ballotOffice: false,
    originalPosition: campaign.details?.positionId,
  });
  const trackingAttrs = useMemo(
    () =>
      buildTrackingAttrs('Onboarding Next Button', {
        step,
      }),
    [step],
  );

  const canSubmit = () => {
    if (step) {
      return !!state.ballotOffice || !!state.originalPosition;
    }
    const orgPosition = campaign.details?.positionId;
    const orgElection = campaign.details?.electionId;
    const orgRace = campaign.details?.raceId;
    const { position, election, id } = state.ballotOffice;
    if (!position || !election) {
      return false;
    }

    return !(
      position?.id === orgPosition &&
      election?.id === orgElection &&
      id === orgRace
    );
  };

  const calcTerm = (position) => {
    if (!position) return undefined;
    if (!position.electionFrequencies) return undefined;
    if (!position.electionFrequencies.length === 0) return undefined;
    if (!position.electionFrequencies[0]) return undefined;
    return `${position.electionFrequencies[0]?.frequency} years`;
  };

  const handleSave = async () => {
    if (!canSubmit()) {
      return;
    }
    const { position, election, id, filingPeriods } = state.ballotOffice;

    const attr = [
      { key: 'details.positionId', value: position?.id },
      { key: 'details.electionId', value: election?.id },
      { key: 'details.raceId', value: id },
      { key: 'details.state', value: election?.state },
      { key: 'details.office', value: 'Other' },
      { key: 'details.otherOffice', value: position?.name },
      {
        key: 'details.officeTermLength',
        value: calcTerm(position),
      },
      { key: 'details.ballotLevel', value: position?.level },
      {
        key: 'details.primaryElectionDate',
        value: election?.primaryElectionDate,
      },
      {
        key: 'details.electionDate',
        value: election?.electionDay,
      },
      {
        key: 'details.partisanType',
        value: position?.partisanType,
      },
      {
        key: 'details.primaryElectionId',
        value: election?.primaryElectionId,
      },
      {
        key: 'details.hasPrimary',
        value: position?.hasPrimary,
      },
      {
        key: 'details.filingPeriodsStart',
        value:
          filingPeriods && filingPeriods.length > 0
            ? filingPeriods[0].startOn
            : undefined,
      },
      {
        key: 'details.filingPeriodsEnd',
        value:
          filingPeriods && filingPeriods.length > 0
            ? filingPeriods[0].endOn
            : undefined,
      },
      // reset the electionType and electionLocation
      // so it can run a full p2v.
      {
        key: 'pathToVictory.electionType',
        value: undefined,
      },
      {
        key: 'pathToVictory.electionLocation',
        value: undefined,
      },
    ];
    if (step) {
      const currentStep = onboardingStep(campaign, step);
      attr.push({ key: 'data.currentStep', value: currentStep });
    }

    if (adminMode) {
      await updateCampaign(attr, campaign.slug);
      await runP2V(campaign.slug);
    } else {
      await updateCampaign(attr);
      await runP2V();
    }

    if (step) {
      router.push(`/onboarding/${campaign.slug}/${step + 1}`);
    }
    if (updateCallback) {
      await updateCallback();
    }
  };

  const handleBallotOffice = async (office) => {
    if (office) {
      setState({
        ...state,
        ballotOffice: office,
        originalPosition: false,
      });
    } else {
      setState({
        ...state,
        ballotOffice: false,
        originalPosition: false,
      });
    }
  };

  const selectedOffice = campaign.details?.positionId
    ? {
        position: { id: campaign.details.positionId },
        election: { id: campaign.details.electionId },
      }
    : false;

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center flex-col pt-12">
        <H1 className="text-center">What office are you interested in?</H1>

        <div className="w-full max-w-2xl mt-10">
          <BallotRaces
            campaign={campaign}
            selectedOfficeCallback={handleBallotOffice}
            selectedOffice={selectedOffice}
            updateCallback={updateCallback}
            step={step}
          />
        </div>
        <div className={`${step ? 'flex justify-end w-full' : ''}`}>
          <Button
            size="large"
            className={{ block: true }}
            disabled={!canSubmit()}
            type="submit"
            onClick={handleSave}
            {...trackingAttrs}
          >
            {step ? 'Next' : 'Save'}
          </Button>
        </div>
      </div>
    </form>
  );
}
