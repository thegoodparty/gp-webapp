import { useState } from 'react'
import Modal from '@shared/utils/Modal'
import H1 from '@shared/typography/H1'
import Button from '@shared/buttons/Button'
import CustomOfficeForm from './CustomOfficeForm'
import Body2 from '@shared/typography/Body2'
import { Campaign } from 'helpers/types'

const STEPS = {
  TROUBLESHOOT: 'troubleshoot',
  SET_CUSTOM_OFFICE: 'set-custom-office',
}

interface CantFindRaceModalProps {
  campaign: Campaign
  onClose: () => void
  onSaveCustomOffice: (campaign: Campaign) => void
}

export default function CantFindRaceModal({
  campaign,
  onClose,
  onSaveCustomOffice,
}: CantFindRaceModalProps) {
  const [step, setStep] = useState(STEPS.TROUBLESHOOT)

  return (
    <Modal open closeCallback={onClose}>
      <div className="max-w-[640px] mx-auto w-[80vw] p-8">
        {step === STEPS.SET_CUSTOM_OFFICE ? (
          <>
            <CustomOfficeForm
              campaign={campaign}
              onSave={onSaveCustomOffice}
              onBack={onClose}
            />
          </>
        ) : (
          <>
            <H1 className="text-center">Troubleshooting</H1>
            <div className="mt-8">
              <Body2 className="bg-white rounded-lg p-6 border border-gray-200">
                <ol className="space-y-4 list-decimal pl-5">
                  <li className="pl-1">
                    Zip Code: Make sure the Zip Code matches the office
                    you&apos;re running for.
                  </li>
                  <li className="pl-1">
                    Office Level: Try another office level to find the correct
                    race.
                  </li>
                  <li className="pl-1">
                    Office Name: Try broadening your search.
                  </li>
                  <li className="pl-1">Double check your candidacy papers.</li>
                </ol>
              </Body2>
              <div className="my-8 text-center">
                <Button
                  color="neutral"
                  size="medium"
                  variant="contained"
                  onClick={onClose}
                >
                  Back to search
                </Button>
              </div>
              <div className="text-center">
                <a
                  className="text-blue-600 hover:text-blue-700 cursor-pointer"
                  onClick={() => setStep(STEPS.SET_CUSTOM_OFFICE)}
                >
                  <Body2>I still don&apos;t see my office</Body2>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
