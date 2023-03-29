import { validateZip } from 'app/(entrance)/register/components/RegisterPage';
import { flatStates } from 'helpers/statesHelper';

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
          'Independent/None',
          'Democrat Party',
          'Republican Party',
          'Green Party',
          'Libertarian Party',
          'Forward Party',
          'Other',
        ],
        invalidOptions: ['Democrat Party', 'Republican Party'],
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
    title: 'Tell us about your prior experience',
    subTitle:
      "Telling potential voters about what you've worked on in the past and any experience that is relevant for the role you plan to run for will increase your odds of winning.",
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
console.log('detailFieldsCount', detailFieldsCount);
export { detailFieldsCount };
