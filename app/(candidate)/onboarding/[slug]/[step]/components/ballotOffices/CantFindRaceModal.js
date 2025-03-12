import { useState } from 'react';
import Modal from '@shared/utils/Modal';
import H1 from '@shared/typography/H1';
import Body1 from '@shared/typography/Body1';
import Button from '@shared/buttons/Button';
import CustomOfficeForm from './CustomOfficeForm';

const STEPS = {
  TROUBLESHOOT: 'troubleshoot',
  SET_CUSTOM_OFFICE: 'set-custom-office',
};

export default function CantFindRaceModal({
  campaign,
  onClose,
  onBack,
  onSaveCustomOffice,
}) {
  const [step, setStep] = useState(STEPS.TROUBLESHOOT);

  return (
    <Modal open closeCallback={onClose}>
      <div className="max-w-[640px] mx-auto w-[80vw] p-8">
        {step === STEPS.SET_CUSTOM_OFFICE ? (
          <>
            <H1 as="h2" className="text-center">
              Office Details
            </H1>
            <CustomOfficeForm campaign={campaign} onSave={onSaveCustomOffice} />
          </>
        ) : (
          <>
            <H1 as="h2" className="text-center">
              Troubleshooting
            </H1>
            <Body1 className="my-8">
              <ol className="list-decimal list-outside font-outfit font-medium ml-8 [&>li]:leading-6 [&>li]:mb-2">
                <li>
                  Ensure you&apos;ve entered the correct ZIP for the office
                  you&apos;re running for.
                </li>
                <li>
                  Ensure you have the correct general election date. If
                  there&apos;s a primary or runoff for your race, still enter
                  the general election date.
                </li>
                <li>
                  Try another office level. Some states report office levels
                  differently than others, so you might need to try another
                  office level to find the correct race.
                </li>
              </ol>
              <Button
                variant="text"
                color="neutral"
                className="mt-2"
                onClick={() => setStep(STEPS.SET_CUSTOM_OFFICE)}
              >
                I&apos;ve tried all of these steps and still can&apos;t find my
                office
              </Button>
            </Body1>

            <div className="flex-col-reverse sm:flex-row flex gap-2 justify-between">
              <Button size="large" color="neutral" onClick={onClose}>
                Close
              </Button>
              <Button size="large" onClick={onBack}>
                Back to search
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
