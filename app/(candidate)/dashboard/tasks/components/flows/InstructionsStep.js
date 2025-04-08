import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { Alert, AlertTitle } from '@mui/material'
import {
  CreateRounded,
  CalendarMonthRounded,
  RocketLaunchRounded,
} from '@mui/icons-material'
import { TASK_TYPES } from '../../constants/tasks.const'

const SMS_CONTENT = [
  {
    iconComponent: CreateRounded,
    title: 'Create',
    text: 'Select your budget, identify your audience, choose a script, and upload an image.',
  },
  {
    iconComponent: CalendarMonthRounded,
    title: 'Schedule',
    text: "Choose when you'd like your campaign to launch. (Requires 72 hours to process.)",
  },
  {
    iconComponent: RocketLaunchRounded,
    title: 'Launch',
    text: "We'll contact you to help refine your script and pay your invoice. Your campaign will launch on your scheduled date.",
  },
]

export default function InstructionsStep({
  type,
  nextCallback,
  closeCallback,
}) {
  // Only has content for SMS campaigns right now
  if (type !== 'sms' && type !== TASK_TYPES.texting) return null

  return (
    <div className="p-4">
      <H1 className="text-center">How does this work?</H1>
      <Body1 className="mt-6 mb-8 min-w-[300px]">
        {SMS_CONTENT.map((item) => (
          <Alert
            key={item.title}
            color="info"
            className="mb-3"
            sx={{ borderRadius: '8px' }}
            icon={<item.iconComponent />}
          >
            <AlertTitle
              sx={{ fontWeight: '700' }}
              className="flex items-center gap-2"
            >
              {item.title}
            </AlertTitle>
            {item.text}
          </Alert>
        ))}
      </Body1>
      <div className="flex justify-between">
        <SecondaryButton onClick={closeCallback}>Cancel</SecondaryButton>
        <PrimaryButton onClick={nextCallback}>Next</PrimaryButton>
      </div>
    </div>
  )
}
