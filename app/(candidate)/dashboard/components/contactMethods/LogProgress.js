import { useState, useMemo } from 'react';
import Modal from '@shared/utils/Modal';
import TextField from '@shared/inputs/TextField';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import InfoButton from '@shared/buttons/InfoButton';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import { AlertBanner } from '../AlertBanner';
import { buildTrackingAttrs } from 'helpers/fullStoryHelper';

export default function LogProgress({
  card,
  reportedVoterGoals = {},
  updateCountCallback,
}) {
  const [showModal, setShowModal] = useState(false);

  const { key, title, modalTitle, modalSubTitle, modalLabel, infoBanner } =
    card;

  const [value, setValue] = useState(0);

  const onChangeField = (val) => {
    setValue(val);
  };

  const handleSubmit = async () => {
    let newAddition = parseInt(value, 10);

    const newTotal = (reportedVoterGoals[key] || 0) + newAddition;
    updateCountCallback(key, newTotal, newAddition);
    setShowModal(false);
    setValue(0);
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
      <InfoButton
        fullWidth
        onClick={() => {
          setShowModal(true);
        }}
        className="log-progress"
      >
        Log Progress
      </InfoButton>
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
              <InfoButton className="" onClick={() => setShowModal(false)}>
                Cancel
              </InfoButton>
              <PrimaryButton
                onClick={handleSubmit}
                disabled={value <= 0}
                {...submitTrackingAttrs}
              >
                Add
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
