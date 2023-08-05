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
        label: 'District',
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
        key: 'city',
        label: 'City',
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

detailFieldsCount = detailFieldsCount - 5; // pledge and top issues
export { detailFieldsCount };

const c = {
  campaignOnboardingSlug: 'tomer-almog',
  firstName: 'Tomer',
  lastName: 'Almog',
  party: 'Independent/None',
  district: '17',
  city: 'Los Angeles',
  state: 'CA',
  office: 'Mayor',
  slogan: '"Tomer Almog: Not in a Party, But Always Ready to Rock!"',
  about:
    '<div class="bg-blue-200 p-5 rounded-lg">\n    <h2 class="text-2xl font-bold mb-5">About Me</h2>\n    <p class="mb-5"><span class="font-bold">My name is Tomer Almog</span>, and I\'m running for US Senate as a member of the Independent/None party. As the CTO of Good Party, I have experience leading teams to accomplish important goals, and I\'m ready to bring that same leadership to the Senate. </p>\n    \n    <p class="mb-5">In my free time, I love playing the guitar and writing songs. Music has been a passion of mine for as long as I can remember, and I believe it has helped me to develop important skills like creativity, perseverance, and willingness to take risks. Whether crafting a song or a policy proposal, I bring the same enthusiasm and dedication to everything I do.</p>\n    \n    <p class="mb-5">I have also served on the local school board for 5 years, where I worked hard to improve the quality of education. I developed policies, secured funding, and established partnerships to increase student achievement, graduation rates, and school facilities. This experience has equipped me with the skills and commitment needed to serve as an elected official in the Senate.</p>\n    \n    <p class="mb-5"><span class="font-bold">My priorities include:</span></p>\n    <ul class="list-disc pl-5 mb-5">\n        <li>Fund Public Schools (Education)</li>\n        <li>Stop Book Bans (Education)</li>\n        <li>Defend 2nd Amendment (Guns)</li>\n    </ul>\n    \n    <p class="mb-5">In the 2023-11-23 election, I am running against John Smith, a corrupt politician from the Democrat Party. I believe that the people of this state deserve better than a corrupt politician, and I am ready to fight for them. So please, vote for me, Tomer Almog, for US Senate on Election Day.</p><p class="mb-5"><br></p><p class="mb-5">sddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsddddddddddddsddsdddddddddddd</p>\n</div>',
  why: '<div class="text-center">\n  <h2 class="font-bold text-2xl">Why I\'m Running for US Senate</h2>\n  <h3 class="font-medium text-lg">By Tomer Almog, Independent</h3>\n</div>\n\n<div class="mt-4">\n  <h4 class="font-medium text-lg">1My Background</h4>\n  <p>I am Tomer Almog, the CTO of Good Party. I am running for US Senate as an Independent candidate. Outside of politics, I am a musician at heart and enjoy playing the guitar and writing songs in my free time. I believe that my passion for music has helped me develop important qualities such as creativity, perseverance, and risk-taking, which are advantageous traits for a public servant.</p>\n</div>\n\n<div class="mt-4">\n  <h4 class="font-medium text-lg">My Experience</h4>\n  <p>I have five years of experience on the local school board where I worked hard to develop policies, secure funding, and establish partnerships that improved the quality of education, leading to higher student achievement, increased graduation rates, and better school facilities. This experience equipped me with the necessary skills and commitment to serve as an elected official.</p>\n</div>\n\n<div class="mt-4">\n  <h4 class="font-medium text-lg">My Agenda</h4>\n  <ul>\n    <li>\n      <p class="font-semibold">Fund Public Schools (Education)</p>\n      <p>As a member of the local school board, I have seen firsthand the impact that underfunded schools have on the quality of education. I will work hard to secure more funding for public schools so that every student has access to a quality education.</p>\n    </li>\n    <li>\n      <p class="font-semibold">Stop Book Bans (Education)</p>\n      <p>Our country was founded on the principles of free speech and open debate. I believe that every student should have access to diverse perspectives on important issues. I will oppose any attempts to ban books or limit academic freedom.</p>\n    </li>\n    <li>\n      <p class="font-semibold">Defend 2nd Amendment (Guns)</p>\n      <p>I support the Second Amendment and believe that law-abiding citizens have the right to bear arms. I will work to protect our constitutional rights while also addressing the issue of gun violence in our communities.</p>\n    </li>\n  </ul>\n</div>\n\n<div class="mt-4">\n  <p class="font-bold">I am running for US Senate because I want to make a positive impact in our communities. As an Independent candidate, I am free from partisan politics and will always put the needs of the people above party interests. I promise to work hard, listen to your concerns, and fight for policies that will benefit all Americans. Thank you for your support!</p>\n</div>',
  pastExperience:
    'I have 5 years of experience on the local school board, where I worked to improve the quality of education by developing policies, securing funding, and establishing partnerships. This led to higher student achievement, increased graduation rates, and better school facilities. This experience has equipped me with the skills and commitment needed to serve as an elected official.',
  occupation: 'CTO of Good Party',
  funFact:
    "I love playing the guitar and writing songs in my free time. I've even performed at a few local open mic nights! Music has been a passion of mine for as long as I can remember, and I believe that it has helped me to develop creativity, perseverance, and a willingness to take risks. Whether writing a song or crafting a policy proposal, I bring the same enthusiasm and dedication to everything I do.",
  voteGoal: 3000,
  voterProjection: 2805,
  color: '#EA932D',
  image:
    'https://assets.goodparty.org/candidate-info/f157e110-2c49-4045-8e80-4e89f65ad97e.jpeg',
  isActive: true,
  electionDate: '2023-11-25',
  slug: 'tomer-almog',
  id: 1,
  customIssues: [
    { title: 'Issue 1', position: 'Issue1 desc', order: 0 },
    { title: 'new issue 3', position: 'new issue 3', order: 2 },
  ],
  finalVotes: 3125,
};
