import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import Paper from '@shared/utils/Paper';
import { FaDoorClosed } from 'react-icons/fa';
import MethodRow from './MethodRow';

const methods = [
  {
    key: 'doorKnocking',
    title: 'Door Knocking',
    description:
      'We recommend door knocking to make up 30% of your overall voter contacts',
    cta: 'Get Door Targets',
    modalTitle: 'Add Doors Knocked',
    modalSubTitle:
      "Update the total number of doors you've knocked on this week:",
    modalLabel: 'Doors Knocked',
    icon: <FaDoorClosed />,
    voterFileKey: 'doorknocking',
  },
  {
    key: 'directMail',
    title: 'Direct Mail',
    description:
      'We recommend direct mail to make up 20% of your overall voter contacts',
    cta: 'Get Email Targets',
    modalTitle: 'Add Direct Mail',
    modalSubTitle:
      "Update the total number of direct mail pieces you've sent this week:",
    modalLabel: 'Mail Sent',
    icon: <FaDoorClosed />,
    voterFileKey: 'directmail',
  },
  {
    key: 'calls',
    title: 'Phone Banking',
    description:
      'We recommend phone banking to make up 10% of your overall voter contacts',
    cta: 'Get Phone Targets',
    modalTitle: 'Add Phone Banking',
    modalSubTitle:
      "Update the total number of constituents you've called this week:",
    modalLabel: 'Calls',
    icon: <FaDoorClosed />,
  },
  {
    key: 'digitalAds',
    title: 'Digital Advertising',
    description:
      'We recommend digital advertising to make up 10% of your overall voter contacts',
    cta: 'Explore Smart Ads',
    modalTitle: 'Add Digital Advertising',
    modalSubTitle:
      "Update the total number of digital ads you've distributed this week:",
    modalLabel: 'Digital Advertising',
    icon: <FaDoorClosed />,
  },
  {
    key: 'text',
    title: 'Texting',
    description:
      'We recommend texting to make up 20% of your overall voter contacts',
    cta: 'Get Text/SMS Targets',
    modalTitle: 'Add Text Messages',
    modalSubTitle:
      "Update the total number of constituents you've texted this week:",
    modalLabel: 'Texts Messages',
    icon: <FaDoorClosed />,
  },
  {
    key: 'events',
    title: 'Events & Rallies',
    description:
      'We recommend events & rallies to make up 10% of your overall voter contacts (1,313 conversations)',
    cta: 'Data-Driven Events',
    modalTitle: 'Add Events & Rallies',
    modalSubTitle: 'Update the total number of people in attendance:',
    modalLabel: 'Attendance',
    icon: <FaDoorClosed />,
  },
  {
    key: 'yardSigns',
    title: 'Yard Signs',
    description:
      'We recommend ordering yard signs for the top 5% of your supporters',
    cta: 'Get Yard Signs',
    modalTitle: 'Add Yard Signs',
    modalSubTitle:
      "Update the total number of yard signs you've distributed this week:",
    infoBanner:
      "As a reminder, lawn signs are good practice for any political campaign but it's unknown how much they contribute to win rate. Adding lawn signs does not increase your % of voters contacted. Any contacts made from lawn signs are a healthy buffer in addition to our formula.",
    modalLabel: 'Yard Signs',
    icon: <FaDoorClosed />,
  },
];

export default function ContactMethodsSection(props) {
  return (
    <Paper>
      <H2>Voter Contact Methods</H2>
      <Body2 className="text-gray-600">Take action on these top tactics:</Body2>
      {methods.map((method) => (
        <MethodRow key={method.key} method={method} {...props} />
      ))}
    </Paper>
  );
}
