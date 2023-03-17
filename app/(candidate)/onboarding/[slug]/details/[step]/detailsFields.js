import { isValidPhone } from '@shared/inputs/PhoneInput';
import { validateZip } from 'app/(entrance)/register/components/RegisterPage';
import { flatStates, states } from 'helpers/statesHelper';

const detailsFields = [
  {
    title:
      "Hi! I'm Jared. I just need a little bit of information to get you started...",

    fields: [
      {
        key: 'firstName',
        label: 'Candidate First Name',
        required: true,
        type: 'text',
      },
      {
        key: 'lastName',
        label: 'Candidate Last Name',
        required: true,
        type: 'text',
      },
    ],
  },
  {
    title:
      "We'll help you figure out the best way to run a successful campaign where you live",
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
    title: "Let's verify your eligibility to run for office.",
    fields: [
      {
        key: 'dob',
        label: 'Date of Birth',
        required: true,
        type: 'date',
      },
      {
        key: 'citizen',
        label: 'Are you a U.S. Citizen?',
        required: true,
        type: 'radio',
        options: ['Yes', 'No'],
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
    title: 'Do you know where you want to run?',
    fields: [
      {
        key: 'knowRun',
        label: '',
        required: true,
        type: 'radio',
        options: ['Yes, I do', 'I need help'],
      },
      {
        key: 'state',
        label: 'State',
        type: 'select',
        options: flatStates,
        hidden: true,
        showKey: 'knowRun',
        showCondition: ['yes'],
      },
      {
        key: 'office',
        label: 'Office',
        type: 'select',
        hidden: true,
        showKey: 'knowRun',
        showCondition: ['yes'],
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
          'State Senate',
          'State House of Representatives',
          'County Executive',
          'Mayor',
          'District Attorney',
          'Sheriff',
          'Clerk',
          'Auditor',
          'Public Administrator',
          'Judge',
          'County Commissioner',
          'Council member',
          'School Board',
        ],
      },
      {
        key: 'district',
        label: 'District',
        type: 'text',
        hidden: true,
        showKey: 'office',
        showCondition: [
          'US House of Representatives',
          'State Senate',
          'State House of Representatives',
          'County Executive',
          'Mayor',
          'District Attorney',
          'Sheriff',
          'Clerk',
          'Auditor',
          'Public Administrator',
          'Judge',
          'County Commissioner',
          'Council member',
          'School Board',
        ],
      },
      {
        key: 'articles',
        type: 'articles',
        hidden: true,
        showKey: 'knowRun',
        showCondition: ['no'],
        articles: ['run-as-independent', 'run-as-independent'],
        title:
          "Looks like you want to get involved in local politics but you're not sure which office?",
        subTitle:
          "Well, you've got a ton of options to choose from - State Senate, City Council, School Board, even Tree Warden! With over 500,000 local elections happening across the US, the possibilities are practically endless. Lucky for you, there are some awesome tools out there to help you figure out which issues you care about most and which office would be the perfect fit for you in your community. Let's check 'em out!",
      },
    ],
  },
  {
    title: 'Have you run for office before?',
    fields: [
      {
        key: 'runBefore',
        label: '',
        required: true,
        type: 'radio',
        options: ['Yes', 'No'],
      },
      {
        key: 'officeRunBefore',
        label: 'What office?',
        type: 'text',
        hidden: true,
        showKey: 'runBefore',
        showCondition: ['yes'],
      },
    ],
  },
  {
    title: 'Have you ever been a registered member of a political party?',
    fields: [
      {
        key: 'registeredBefore',
        label: '',
        required: true,
        type: 'radio',
        options: ['Yes', 'No'],
      },
      {
        key: 'partyBefore',
        label: 'Which Party?',
        type: 'select',
        hidden: true,
        showKey: 'registeredBefore',
        showCondition: ['yes'],
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
    title: 'Tell us about your prior experience',
    subTitle:
      "Telling potential voters about what you've worked on in the past and any experience that is relevant for the role you plan to run for will increase your odds of winning.",
    fields: [
      {
        key: 'pastExperience',
        label: '',
        required: true,
        type: 'text',
        rows: 6,
      },
    ],
  },
  {
    title: 'What is your current occupation?',
    fields: [
      {
        key: 'occupation',
        label: '',
        required: true,
        type: 'text',
      },
    ],
  },
  {
    title: 'What is a fun fact about yourself?',
    skipable: true,
    fields: [
      {
        key: 'funFact',
        label: '',
        required: true,
        type: 'text',
        rows: 3,
      },
    ],
  },
  {
    pageType: 'issuesPage',
    title: 'Tell us about some issues you care about and why.',
    fields: [],
  },
  {
    pageType: 'pledgePage',
    title: 'Read and Take the Good Party Pledge.',
    fields: [],
  },
  {
    pageType: 'finalDetailsPage',
    title: "We're crunching the numbers for Maine District 10.",
    fields: [],
  },
];

export default detailsFields;

let detailFieldsCount = 0;
detailsFields.forEach((step) => {
  detailFieldsCount += step.fields?.length || 0;
});

detailFieldsCount = detailFieldsCount + 2; // pledge and top issues
export { detailFieldsCount };
