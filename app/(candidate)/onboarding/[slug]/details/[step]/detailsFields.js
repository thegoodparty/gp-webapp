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
        validateOptions: ['yes', 'No'],
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
        invalidOptions: ['Democratic Party', 'Republican Party'],
      },
      {
        key: 'otherParty',
        label: 'Party Name',
        type: 'text',
        hidden: true,
        showKey: 'party',
        showCondition: ['Other'],
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
        validateOptions: ['yes'],
      },
      {
        key: 'state',
        label: 'State',
        type: 'select',
        options: flatStates,
        hidden: true,
        showKey: 'knowRun',
        showCondition: ['yes'],
        required: true,
      },
      {
        key: 'office',
        label: 'Office',
        type: 'select',
        hidden: true,
        showKey: 'knowRun',
        required: true,
        showCondition: ['yes'],
        options: [
          'City Council',
          'Mayor',
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
          'District Attorney',
          'Sheriff',
          'Clerk',
          'Auditor',
          'Public Administrator',
          'Judge',
          'County Commissioner',
          'Council member',
          'School Board',
          'Other',
        ],
      },
      {
        key: 'district',
        label: 'Jurisdiction (City, District, etc.)',
        type: 'text',
        hidden: true,
        requiredHidden: true,
        showKey: 'office',
        showCondition: [
          'City Council',
          'Mayor',
          'US House of Representatives',
          'State Senate',
          'State House of Representatives',
          'County Executive',
          'District Attorney',
          'Sheriff',
          'Clerk',
          'Auditor',
          'Public Administrator',
          'Judge',
          'County Commissioner',
          'Council member',
          'School Board',
          'Other',
        ],
      },
      {
        key: 'articles',
        type: 'articles',
        hidden: true,
        showKey: 'knowRun',
        showCondition: ['no'],
        articles: [],
        title:
          "Looks like you want to explore running for office but aren't sure where to start? No problem!",
        subTitle:
          "You have a ton of options to choose from. With over 500,000 local, state and federal offices to choose from it can be a bit overwhelming. Good news though, we've narrowed it down to the offices you can choose from based on your current residency.",
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
    title: 'Tell us about 3 to 5 issues you care about and why.',
    fields: [],
  },
  {
    pageType: 'pledgePage',
    title: 'Read and Take the Good Party Pledge.',
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

detailFieldsCount = detailFieldsCount - 2; // pledge and top issues
export { detailFieldsCount };
