import { useState, useMemo } from 'react';
import Modal from '@shared/utils/Modal';
import TextField from '@shared/inputs/TextField';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import { AlertBanner } from '../AlertBanner';
import { buildTrackingAttrs } from 'helpers/fullStoryHelper';
import Button from '@shared/buttons/Button';

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
      <Button
        color="neutral"
        size="large"
        onClick={() => {
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
                onClick={() => setShowModal(false)}
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
