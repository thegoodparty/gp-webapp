const goalsFields = [
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
    title: "What's the date of election?",
    skipable: true,
    skipLabel: "I don't know",
    fields: [
      {
        key: 'electionDate',
        label: 'Date of Election',
        type: 'date',
      },
    ],
  },

  {
    title: 'Who are you running against?',
    subTitle:
      "List the name or describe you will be running against. We'll use this information to generate a messaging strategy. If you don’t know, Google it.",
    pageType: 'runningAgainst',
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
];

export default goalsFields;

let goalsFieldsCount = 0;
goalsFields.forEach((step) => {
  goalsFieldsCount += step.fields?.length || 0;
});

goalsFieldsCount = goalsFieldsCount;
export { goalsFieldsCount };
