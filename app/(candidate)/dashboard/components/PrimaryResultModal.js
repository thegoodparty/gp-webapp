import { useState } from 'react';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { dateUsHelper } from 'helpers/dateHelper';
import Modal from '@shared/utils/Modal';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import RadioList from '@shared/inputs/RadioList';
import Button from '@shared/buttons/Button';
import PartyAnimation from '@shared/animations/PartyAnimation';
import { useSnackbarState } from '@shared/utils/Snackbar';

function WonMessage({ electionDate }) {
  return (
    <>
      <PartyAnimation loop={true} />
      <H1 className="mb-4 mt-5">Congratulations!</H1>
      <Body2>
        We&apos;ve updated your campaign goals to the next election date:
        <span className="font-bold">&nbsp;{dateUsHelper(electionDate)}</span>.
        Let&apos;s prepare for the upcoming challenge!
      </Body2>
    </>
  );
}

function LostMessage() {
  return (
    <>
      <div className="text-8xl mb-6 mt-12">
        <span role="img" aria-label="Frowning Face">
          ☹️
        </span>
      </div>
      <H1 className="mb-4">We&apos;re sorry.</H1>
      <Body2>
        We hope you consider running in a future election or supporting other
        GoodParty.org candidates to continue making an impact.
      </Body2>
    </>
  );
}

export default function PrimaryResultModal({
  open,
  officeName,
  electionDate,
  onClose,
}) {
  const snackbarState = useSnackbarState();
  const [primaryResult, setPrimaryResult] = useState(null);
  const [requestState, setRequestState] = useState({
    loading: false,
    error: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const options = [
    { key: 'won', label: 'I won my race' },
    { key: 'lost', label: 'I did not win my race' },
  ];

  async function handleSubmit(e) {
    e.preventDefault();

    setRequestState({
      loading: true,
      error: false,
    });

    try {
      await updateCampaign([
        { key: 'details.primaryResult', value: primaryResult },
      ]);

      setFormSubmitted(true);
      setRequestState({ loading: false, error: false });
    } catch (e) {
      console.error('Error submiting Primary Result:', e);
      snackbarState.set({
        isOpen: true,
        message: 'Failed to submit election result.',
        isError: true,
      });

      setRequestState({ loading: false, error: true });
    }
  }

  return (
    <Modal open={open} boxClassName="p-16 pt-0" preventBackdropClose hideClose>
      {!formSubmitted ? (
        <form onSubmit={handleSubmit} className="pt-16 max-w-[640px]">
          <H1 className="mb-4 text-center">
            Election Results:
            <br />
            {officeName}
          </H1>
          <Body2 className="mb-8 text-center">
            It looks like your primary election date has passed. To keep your
            campaign targets accurate, please confirm the outcome of your
            primary election.
          </Body2>

          {!requestState.error ? (
            <RadioList
              options={options}
              selected={primaryResult}
              selectCallback={setPrimaryResult}
            />
          ) : (
            <Body2 className="text-red text-center">
              An error occured when saving your Primary Election result, please
              try again later.
            </Body2>
          )}

          <div className="mt-12 flex gap-4 justify-center">
            <Button
              disabled={requestState.loading}
              onClick={() => onClose()}
              type="button"
              color="neutral"
              size="large"
              className="px-16"
            >
              Cancel
            </Button>
            <Button
              disabled={
                !primaryResult || requestState.loading || requestState.error
              }
              loading={requestState.loading}
              type="submit"
              size="large"
              className="px-16"
            >
              Submit
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          {primaryResult === 'won' ? (
            <WonMessage electionDate={electionDate} />
          ) : (
            <LostMessage />
          )}
          <Button
            onClick={() => onClose(primaryResult)}
            size="large"
            className="w-full mt-8"
          >
            Back to Dashboard
          </Button>
        </div>
      )}
    </Modal>
  );
}
