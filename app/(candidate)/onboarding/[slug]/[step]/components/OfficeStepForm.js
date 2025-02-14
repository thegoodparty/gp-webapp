'use client';
import Button from '@shared/buttons/Button';
import { useUser } from '@shared/hooks/useUser';
import RenderInputField from '@shared/inputs/RenderInputField';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import { validateZip } from 'app/(entrance)/sign-up/components/SignUpPage';
import { Fragment, useState } from 'react';

const fields = [
  {
    key: 'zip',
    label: 'Zipcode',
    type: 'number',
    required: true,
  },
  {
    key: 'level',
    label: 'Level',
    type: 'select',
    required: true,
    options: ['Local/Township/City', 'County/Regional', 'State', 'Federal'],
  },
  {
    key: 'electionDate',
    label: 'General Election Date (Optional)',
    type: 'date',
  },
];

export default function OfficeStepForm(props) {
  const { campaign, handleNextPart, level, zip, electionDate } = props;
  const [processing, setProcessing] = useState(false);
  const [state, setState] = useState({
    zip: zip || '',
    level: level || '',
    electionDate: electionDate || '',
  });
  const [user, _] = useUser();

  const canSubmit = () => {
    return state.zip && state.level && validateZip(state.zip);
  };

  const handleNext = async () => {
    setProcessing(true);

    if (!canSubmit()) {
      setProcessing(false);
      return;
    }

    handleNextPart(state.zip, state.level, state.electionDate);
    setProcessing(false);
  };

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
    // Clear error when user types
  };

  return (
    <>
      <H1 className="text-center">
        Welcome, {user?.firstName} {user?.lastName}
        <br />
        Let&apos;s look for your office
      </H1>
      <Body1 className="text-center mt-4">
        To pull accurate results, please fill in the missing information:
      </Body1>
      <div className="w-full max-w-2xl mt-10">
        {fields.map((field) => (
          <Fragment key={field.key}>
            <RenderInputField
              field={field}
              onChangeCallback={onChangeField}
              value={state[field.key]}
            />
          </Fragment>
        ))}
      </div>
      <div className="flex justify-end w-full">
        <Button
          size="large"
          className={{ block: true }}
          disabled={!canSubmit() || processing}
          loading={processing}
          type="submit"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </>
  );
}
