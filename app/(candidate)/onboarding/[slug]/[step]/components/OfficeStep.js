'use client';
import {
  onboardingStep,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useRouter } from 'next/navigation';
import BallotRaces from './ballotOffices/BallotRaces';
import { useState, useMemo } from 'react';
import { buildTrackingAttrs } from 'helpers/fullStoryHelper';
import Button from '@shared/buttons/Button';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';
import OfficeStepForm from './OfficeStepForm';
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper';

async function runP2V(slug) {
  try {
    const resp = await clientFetch(apiRoutes.campaign.pathToVictory.create, {
      slug,
    });

    return resp.data;
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
  const [part, setPart] = useState(1); // this step has two parts.

  const [processing, setProcessing] = useState(false);
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
    setProcessing(true);
    if (!canSubmit()) {
      setProcessing(false);
      return;
    }

    trackEvent(EVENTS.Onboarding.OfficeStep.ClickNext, {
      step,
    });

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
    setProcessing(false);
  };

  const handleBallotOffice = async (office) => {
    if (office) {
      trackEvent(EVENTS.Onboarding.OfficeStep.OfficeSelected, {
        office: office?.position?.name,
      });

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

  const handleNextPart = (zip, level, electionDate) => {
    setState({
      ...state,
      ballotSearch: {
        zip,
        level,
        electionDate,
      },
    });
    setPart(2);
  };

  const handleBack = () => {
    trackEvent(EVENTS.Onboarding.OfficeStep.ClickBack, {
      step,
    });
    setPart(1);
  };

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center flex-col">
        {part === 1 && (
          <OfficeStepForm
            campaign={campaign}
            handleNextPart={handleNextPart}
            zip={state.ballotSearch?.zip || campaign.details?.zip}
            level={state.ballotSearch?.level || ''}
            electionDate={state.ballotSearch?.electionDate || ''}
          />
        )}
        {part === 2 && (
          <>
            <div className="w-full max-w-2xl mt-10">
              <BallotRaces
                campaign={campaign}
                selectedOfficeCallback={handleBallotOffice}
                selectedOffice={selectedOffice}
                updateCallback={updateCallback}
                step={step}
                zip={state.ballotSearch.zip}
                level={state.ballotSearch.level}
                electionDate={state.ballotSearch.electionDate}
              />
            </div>
            <div className="flex justify-between w-full">
              <Button
                size="large"
                color="neutral"
                className={{ block: true }}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                size="large"
                className={{ block: true }}
                disabled={!canSubmit() || processing}
                loading={processing}
                type="submit"
                onClick={handleSave}
                {...trackingAttrs}
              >
                {step ? 'Next' : 'Save'}
              </Button>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
