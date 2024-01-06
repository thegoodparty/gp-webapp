import { validateZip } from 'app/(entrance)/register/components/RegisterPage';
import { flatStates } from 'helpers/statesHelper';

const detailsFields = [
  {
    title:
      "Hi! I'm Good Party's AI Campaign Manager. I just need a little bit of information to get you started...",

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
    title: 'Please provide your phone number',
    fields: [
      {
        key: 'campaignPhone',
        label: 'Phone',
        required: true,
        type: 'phone',
        validate: 'validPhone',
      },
    ],
  },
  {
    title:
      "We'll help you figure out the best way to run a successful campaign where you live.",
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
        validate: 'over 18',
      },
      {
        key: 'citizen',
        label: 'Are you a U.S. Citizen?',
        required: true,
        type: 'radio',
        options: ['Yes', 'No'],
        validateOptions: ['yes', 'no'],
      },
    ],
  },

  {
    title: 'Have you filed a statement of candidacy?',
    fields: [
      {
        key: 'filedStatement',
        label: '',
        required: true,
        type: 'radio',
      },
      {
        key: 'campaignCommittee',
        label: 'Name of Campaign Committee',
        placeholder: 'Campaign Committee',
        type: 'text',
        hidden: true,
        showKey: 'filedStatement',
        showCondition: ['yes'],
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
          'Democratic Party',
          'Republican Party',
          'Green Party',
          'Libertarian Party',
          'Forward Party',
          'Other',
        ],
        invalidOptions: ['democratic party', 'republican party'],
      },
      {
        key: 'otherParty',
        label: 'Party Name',
        type: 'text',
        hidden: true,
        showKey: 'party',
        showCondition: ['Other'],
        invalidOptions: [
          'democrat',
          'democratic party',
          'dnc',
          'dem',
          'blue dog democrat',
          'progressive democrat',
          'liberal democrat',
          'democratic national committee',
          'dccc',
          'democratic congressional campaign committee',
          'blue state democrat',
          'dem',
          'democratic',
          'blue democrat',
          'dem caucus',
          'democratic caucus',
          'democratic primary',
          'dem primary',
          'democratic convention',
          'dem convention',
          'blue wave',
          'dem pac',
          'democratic pac',
          'dem super pac',
          'democratic super pac',
          'dem candidate',
          'democratic candidate',
          'state democrat',
          'local democrat',
          'county democrat',
          'district democrat',
          'dem committee',
          'democratic committee',
          'dem delegate',
          'democratic delegate',
          'dem platform',
          'democratic platform',
          'dem endorsement',
          'democratic endorsement',
          'dem policies',
          'democratic policies',
          'dem values',
          'democratic values',
          'dem voter',
          'democratic voter',
          'dem supporter',
          'democratic supporter',
          'dem activist',
          'democratic activist',
          'republican',
          'gop',
          'rnc',
          'rep',
          'grand old party',
          'republican party',
          'conservative republican',
          'right-wing republican',
          'republican national committee',
          'nrcc',
          'republican congressional campaign committee',
          'red state republican',
          'repub',
          'republican',
          'red republican',
          'rep caucus',
          'republican caucus',
          'republican primary',
          'rep primary',
          'republican convention',
          'rep convention',
          'red wave',
          'rep pac',
          'republican pac',
          'rep super pac',
          'republican super pac',
          'rep candidate',
          'republican candidate',
          'state republican',
          'local republican',
          'county republican',
          'district republican',
          'rep committee',
          'republican committee',
          'rep delegate',
          'republican delegate',
          'rep platform',
          'republican platform',
          'rep endorsement',
          'republican endorsement',
          'rep policies',
          'republican policies',
          'rep values',
          'republican values',
          'rep voter',
          'republican voter',
          'rep supporter',
          'republican supporter',
          'rep activist',
          'republican activist',
        ],
      },
    ],
  },
  {
    pageType: 'officePage',
    title: 'Do you know where you want to run?',
    fields: [],
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
    title:
      'Tell us about your past experiences and why you want to run for office',
    subTitle:
      'Tell potential voters about your prior experience. Any work or experiences that are relevant to the role you plan to run for will increase your odds of gaining their support.',
    fields: [
      {
        key: 'pastExperience',
        label: '',
        placeholder:
          'EXAMPLE: I have 5 years of experience on the local school board, where I worked to improve the quality of education by developing policies, securing funding, and establishing partnerships. This led to higher student achievement, increased graduation rates, and better school facilities. This experience has equipped me with the skills and commitment needed to serve as an elected official.',
        required: true,
        type: 'text',
        rows: 10,
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
    subTitle:
      "What's something fun or interesting about you- unrelated to politics- that you think people in your community would like to know?",
    fields: [
      {
        key: 'funFact',
        label: '',
        placeholder:
          "EXAMPLE: In my free time, I love to play the guitar and write songs. I've even performed at a few local open mic nights! Music has been a passion of mine for as long as I can remember, and I believe that it has helped me to develop creativity, perseverance, and a willingness to take risks. Whether I'm writing a song or crafting a policy proposal, I bring the same level of enthusiasm and dedication to everything I do.",
        required: true,
        type: 'text',
        rows: 8,
      },
    ],
  },
  {
    pageType: 'issuesPage',
    title: 'Tell us about three issues you care about and why.',
    fields: [],
  },
  {
    pageType: 'pledgePage',
    title: 'Good Party User Agreement.',
    fields: [],
  },
  {
    pageType: 'finalDetailsPage',
    title:
      'Thanks for taking the first step to get in the arena and create change!',
    fields: [],
  },
];

export default detailsFields;

let detailFieldsCount = 0;
detailsFields.forEach((step) => {
  detailFieldsCount += step.fields?.length || 0;
});

detailFieldsCount = detailFieldsCount - 8; // pledge and top issues
export { detailFieldsCount };
