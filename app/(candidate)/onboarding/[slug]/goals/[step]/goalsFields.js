const goalsFields = [
  {
    title: 'Tell us why you are running.',
    subTitle:
      'Candidates who have a compelling story have a better chance of winning. Tell us a little about you and use our AI to help build your story.',
    fields: [
      {
        key: 'whyRunning',
        label: '',
        required: true,
        type: 'text',
        rows: 6,
        enhanceAi: true,
      },
    ],
  },
  {
    title: 'Provide the Date of Election',
    subTitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id lorem dapibus, porta lorem vitae, vehicula nisi. Aenean non congue metus. Nam vel enim.',
    fields: [
      {
        key: 'electionDate',
        label: 'Date of Election',
        required: true,
        type: 'date',
      },
    ],
  },
  {
    title: 'Have you filed a statement of candidacy?',
    subTitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id lorem dapibus, porta lorem vitae, vehicula nisi. Aenean non congue metus. Nam vel enim.',
    fields: [
      {
        key: 'filedStatement',
        label: '',
        required: true,
        type: 'radio',
      },
      {
        key: 'statementName',
        label: 'Great! Tell Us More. What is the name on the statement?',
        placeHolder: 'Name',
        type: 'text',
        hidden: true,
        showKey: 'filedStatement',
        showCondition: ['yes'],
      },
      {
        key: 'campaignCommittee',
        label: 'Campaign Committee',
        placeHolder: 'Campaign Committee',
        type: 'text',
        hidden: true,
        showKey: 'filedStatement',
        showCondition: ['yes'],
      },
    ],
  },
  {
    title: 'Who are you running against?',
    subTitle:
      "List the name or describe you will be running against. We'll use this information to generate a Tully Box for you, so you will know the best approach against your competition",
    fields: [
      {
        key: 'runningAgainstName',
        label: 'Name',
        type: 'text',
      },
      {
        key: 'runningAgainstDescription',
        label: 'Description',
        type: 'text',
        rows: 4,
      },
    ],
  },
  {
    title: 'Messaging Strategy',
    pageType: 'messagingStrategy',
    subTitle:
      "What the politicos call a 4 way messaging box. Learn what you should say about yourself and what your competition will try to say about you. Don't worry we'll save this for you to review at your leisure.",
    fields: [],
  },
];

export default goalsFields;

let goalsFieldsCount = 0;
goalsFields.forEach((step) => {
  goalsFieldsCount += step.fields?.length || 0;
});

goalsFieldsCount = goalsFieldsCount + 1; // Messaging Strategy
export { goalsFieldsCount };
