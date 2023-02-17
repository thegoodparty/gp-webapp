import { isValidPhone } from '@shared/inputs/PhoneInput';
import { validateZip } from 'app/(entrance)/register/components/RegisterPage';
import { flatStates, states } from 'helpers/statesHelper';

const goalsFields = [
  {
    title: "Great to meet you [[NAME]]! What's your phone number?",
    fields: [
      {
        key: 'phone',
        label: 'Phone Number',
        required: true,
        type: 'phone',
        validate: isValidPhone,
      },
    ],
  },
  {
    title: "Great! What's your zip code?",
    fields: [
      {
        key: 'zip',
        label: 'Zip Code',
        required: true,
        type: 'text',
        validate: validateZip,
      },
    ],
  },
  {
    title: 'Are you a US Citizen?',
    fields: [
      {
        key: 'citizen',
        label: '',
        required: true,
        type: 'radio',
        options: ['Yes', 'No'],
      },
    ],
  },
  {
    title: 'What is your date of birth?',
    fields: [
      {
        key: 'dob',
        label: 'Date of Birth',
        required: true,
        type: 'date',
      },
    ],
  },
  {
    title: "Thanks! What's your political affiliation, if you have any?",
    fields: [
      {
        key: 'party',
        label: 'Political Party Affiliation (select one)',
        required: true,
        type: 'select',
        options: [
          'Independent',
          'Green Party',
          'Libertarian',
          'SAM',
          'Forward',
          'Other',
        ],
      },
    ],
  },
  {
    title: 'Great! Where are you considering running for office?',
    fields: [
      {
        key: 'state',
        label: 'State',
        required: true,
        type: 'select',
        options: flatStates,
      },
      {
        key: 'office',
        label: 'Office',
        required: true,
        type: 'select',
        options: [
          'President',
          'US Senate',
          'US House of Representatives',
          'Governor',
          'Lieutenant Governor',
          'Attorney General',
          'Comptroller',
          'Treasurer',
          'Secretary of State',
          'State Supreme Court Justice',
          'County Executive',
          'Mayor',
          'District Attorney',
          'Sheriff',
          'Clerk',
          'Auditor',
          'Public Administrator',
          'Judge',
        ],
      },
    ],
  },
];

export default goalsFields;
