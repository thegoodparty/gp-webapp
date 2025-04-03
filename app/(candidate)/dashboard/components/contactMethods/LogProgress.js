import { useState, useMemo } from 'react';
import Modal from '@shared/utils/Modal';
import TextField from '@shared/inputs/TextField';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import { AlertBanner } from '../AlertBanner';
import {
  buildTrackingAttrs,
  EVENTS,
  trackEvent,
} from 'helpers/fullStoryHelper';
import Button from '@shared/buttons/Button';
import { useVoterContacts } from '@shared/hooks/useVoterContacts';
import { useCampaignUpdateHistory } from '@shared/hooks/useCampaignUpdateHistory';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';
import { useUser } from '@shared/hooks/useUser';
import { getUserFullName } from '@shared/utils/getUserFullName';

async function createUpdateHistory(payload) {
  const resp = await clientFetch(
    apiRoutes.campaign.updateHistory.create,
    payload,
  );
  return resp.data;
}

export default function LogProgress({ card }) {
  const [reportedVoterGoals, setReportedVoterGoals] = useVoterContacts();
  const [_, setUpdateHistory] = useCampaignUpdateHistory();
  const [user] = useUser();
  const [showModal, setShowModal] = useState(false);

  const {
    key,
    title,
    modalTitle,
    modalSubTitle,
    modalLabel,
    infoBanner,
    onLogClick,
  } = card;

  const [value, setValue] = useState(0);

  const onChangeField = (val) => {
    setValue(val);
  };

  const handleSubmit = async () => {
    let newAddition = parseInt(value, 10);

    trackEvent(EVENTS.Dashboard.VoterContact.LogProgress.ClickAdd, {
      key,
      title,
      value,
    });

    setReportedVoterGoals({
      ...reportedVoterGoals,
      [key]: (reportedVoterGoals[key] || 0) + newAddition,
    });

    // Create update history entry
    const newHistoryItem = await createUpdateHistory({
      type: key,
      quantity: newAddition,
    });
    setUpdateHistory((prev) => [
      ...prev,
      {
        ...newHistoryItem,
        // TODO: We have to do this nonsense because this endpoint is still doing
        //  wonky nonsense w/ putting a poorly formed "user" object on it's response
        user: {
          id: user.id,
          name: getUserFullName(user),
          ...(user.avatar ? { avatar: user.avatar } : {}),
        },
      },
    ]);

    setShowModal(false);
    setValue(0);
  };

  const handleClose = () => {
    trackEvent(EVENTS.Dashboard.VoterContact.LogProgress.Exit, {
      key,
      title,
    });
    setShowModal(false);
  };

  const submitTrackingAttrs = useMemo(
    () =>
      buildTrackingAttrs('Log Progress Submit Button', {
        key,
        title,
        value,
      }),
    [key, title, value],
  );

  return (
    <div className="">
      <Button
        color="neutral"
        size="large"
        onClick={() => {
          onLogClick();
          setShowModal(true);
        }}
        className="log-progress w-full"
      >
        Log Progress
      </Button>
      {showModal ? (
        <Modal closeCallback={() => setShowModal(false)} open>
          <div className="w-[80vw] max-w-[640px] lg:p-6">
            <H1 className="mb-6 text-center">{modalTitle}</H1>
            <Body2 className="mb-6 text-center">{modalSubTitle}</Body2>
            {infoBanner && (
              <div className="mb-6">
                <AlertBanner message={infoBanner} />
              </div>
            )}
            <TextField
              label={`Total ${modalLabel}`}
              onChange={(e) => onChangeField(e.target.value)}
              value={value}
              fullWidth
              type="number"
              required
            />

            <div className="flex justify-between items-center mt-6">
              <Button
                size="large"
                color="neutral"
                className=""
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                size="large"
                onClick={handleSubmit}
                disabled={value <= 0}
                {...submitTrackingAttrs}
              >
                Add
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
