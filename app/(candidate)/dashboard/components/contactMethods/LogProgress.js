import { useMemo, useState } from 'react';
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
import { useUser } from '@shared/hooks/useUser';
import {
  createIrresponsiblyMassagedHistoryItem,
  createUpdateHistory,
} from '@shared/utils/campaignUpdateHistoryServices';

export default function LogProgress({ card }) {
  const [reportedVoterGoals, setReportedVoterGoals] = useVoterContacts();
  const [updateHistoryItems, setUpdateHistory] = useCampaignUpdateHistory();
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

    const newHistoryItem = await createUpdateHistory({
      type: key,
      quantity: newAddition,
    });

    setUpdateHistory([
      ...updateHistoryItems,
      createIrresponsiblyMassagedHistoryItem(newHistoryItem, user),
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
              min="0"
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
