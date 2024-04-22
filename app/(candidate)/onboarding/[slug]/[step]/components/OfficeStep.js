'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import H1 from '@shared/typography/H1';
import {
  onboardingStep,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useRouter } from 'next/navigation';
import BallotRaces from './ballotOffices/BallotRaces';
import { useState } from 'react';

export default function OfficeStep(props) {
  const { campaign, step, updateCallback } = props;
  const router = useRouter();
  const [state, setState] = useState({
    ballotOffice: false,
    originalPosition: campaign.details?.positionId,
  });

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
    return `${position.electionFrequencies[0].frequency} years`;
  };

  const handleSave = async () => {
    if (!canSubmit()) {
      return;
    }
    const { position, election, id } = state.ballotOffice;

    const currentStep = onboardingStep(campaign, step);
    const keys = [
      'data.currentStep',
      'details.positionId',
      'details.electionId',
      'details.raceId',
      'details.state',
      'details.office',
      'details.otherOffice',
      'details.officeTermLength',
      'details.ballotLevel',
      'details.primaryElectionDate',
      'details.electionDate',
      'details.partisanType',
      'details.primaryElectionId',
      'details.hasPrimary',
    ];
    const values = [
      currentStep,
      state.ballotOffice.position?.id,
      state.ballotOffice.election?.id,
      state.ballotOffice.id,
      state.ballotOffice.election?.state,
      'Other',
      state.ballotOffice.position?.name,
      calcTerm(state.ballotOffice.position),
      state.ballotOffice.position?.level,
      state.ballotOffice.election?.primaryElectionDate,
      state.ballotOffice.election?.electionDay,
      state.ballotOffice.position?.partisanType,
      state.ballotOffice.election?.primaryElectionId,
      state.ballotOffice.position?.hasPrimary,
    ];
    await updateCampaign(keys, values);

    // TODO: need to recalculate p2vStatus in a different call
    /*
    if (!step) {
      // delete p2vStatus so the backend will recalculate it
      delete updated.p2vStatus;
    }
    */

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
      <div className="flex items-center flex-col py-12">
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
        <div className={`${step ? 'fixed bottom-0 w-full bg-white py-4' : ''}`}>
          <PrimaryButton
            className={{ 'mx-auto': true, block: true }}
            disabled={!canSubmit()}
            type="submit"
            onClick={handleSave}
          >
            {step ? 'Next' : 'Save'}
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
