import H1 from '@shared/typography/H1';
import Body1 from '@shared/typography/Body1';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { Alert, AlertTitle } from '@mui/material';
import {
  CreateRounded,
  CalendarMonthRounded,
  RocketLaunchRounded,
} from '@mui/icons-material';

const SMS_CONTENT = [
  {
    iconComponent: CreateRounded,
    title: 'Create',
    text: 'Select your budget, identify your audience, and choose your script.',
    // TODO: Switch to below text when Image Upload ticket is implemented
    // text: 'Select your budget, identify your audience, choose your script, and upload an image.',
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
];

export default function ScheduleFlowStep0({
  type,
  nextCallback,
  closeCallback,
}) {
  // Only has content for SMS campaigns right now
  if (type !== 'sms') return null;

  return (
    <div className="p-4">
      <H1 className="text-center">How does this work?</H1>
      <Body1 className="mt-6 mb-8 min-w-[300px]">
        {SMS_CONTENT.map((item) => (
          <Alert
            key={item.title}
            className="mb-3 bg-neutral-background rounded-md text-primary"
            icon={
              <item.iconComponent className="hidden md:block fill-gray-500" />
            }
          >
            <AlertTitle className="font-bold flex items-center gap-2">
              <item.iconComponent className="block md:hidden fill-gray-500" />
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
  );
}
