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
import Modal from '@shared/utils/Modal';
import CustomOfficeModal from './ballotOffices/CustomOfficeModal';

export default function OfficeStep(props) {
  const { campaign, step } = props;
  const router = useRouter();
  const [state, setState] = useState({
    ballotOffice: false,
    originalPosition: campaign.details?.positionId,
  });
  const [showModal, setShowModal] = useState(false);

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const canSubmit = () => {
    return !!state.ballotOffice || !!state.originalPosition;
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
      };
      if (!updated.goals) {
        updated.goals = {};
      }
      updated.goals = {
        ...updated.goals,
        electionDate: election?.electionDay,
      };
      updated.currentStep = onboardingStep(campaign, step);
      await updateCampaign(updated);
      router.push(`/onboarding/${campaign.slug}/${step + 1}`);
    }
  };

  const saveCustomOffice = async (updated) => {
    await updateCampaign(updated);
    updated.currentStep = campaign.currentStep
      ? Math.max(campaign.currentStep, step)
      : step;
    await updateCampaign(updated);
    router.push(`/onboarding/${campaign.slug}/${step + 1}`);
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

  const showCustomModal = () => {
    setShowModal(true);
  };
  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center flex-col text-center py-12">
        <H1>What office are you interested in?</H1>

        <div className="w-full max-w-md mt-10">
          <BallotRaces
            campaign={campaign}
            selectedOfficeCallback={handleBallotOffice}
            selectedOffice={selectedOffice}
          />
        </div>
        <div className="fixed bottom-0 w-full bg-white py-4">
          <div onClick={handleSave}>
            <PrimaryButton disabled={!canSubmit()} type="submit">
              Next
            </PrimaryButton>
          </div>
          {/* <div onClick={showCustomModal} className="mt-2 cursor-pointer">
            I don&apos;t see my office
          </div> */}
        </div>
      </div>
      {/* {showModal && (
        <Modal
          open
          closeCallback={() => {
            setShowModal(false);
          }}
        >
          <CustomOfficeModal
            campaign={campaign}
            nextCallback={saveCustomOffice}
          />
        </Modal>
      )} */}
    </form>
  );
}
