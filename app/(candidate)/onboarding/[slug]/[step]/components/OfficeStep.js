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
    if (canSubmit()) {
      const updated = campaign;
      const { position, election, id } = state.ballotOffice;
      updated.details = {
        ...campaign.details,
        positionId: position?.id,
        electionId: election?.id,
        raceId: id,
        state: election?.state,
        office: 'Other',
        otherOffice: position?.name,
        officeTermLength: calcTerm(position),
        ballotLevel: position?.level,
      };
      if (!updated.goals) {
        updated.goals = {};
      }
      updated.goals = {
        ...updated.goals,
        electionDate: election?.electionDay,
      };
      if (!step) {
        // delete p2vStatus so the backend will recalculate it
        delete updated.p2vStatus;
      }
      await updateCampaign(updated);

      if (step) {
        updated.currentStep = onboardingStep(campaign, step);
        router.push(`/onboarding/${campaign.slug}/${step + 1}`);
      }
      if (updateCallback) {
        await updateCallback();
      }
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
          <div onClick={handleSave}>
            <PrimaryButton disabled={!canSubmit()} type="submit">
              {step ? 'Next' : 'Save'}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </form>
  );
}
