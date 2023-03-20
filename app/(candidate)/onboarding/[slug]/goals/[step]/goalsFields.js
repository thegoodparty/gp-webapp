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
];

export default goalsFields;

let goalsFieldsCount = 0;
goalsFields.forEach((step) => {
  goalsFieldsCount += step.fields?.length || 0;
});

goalsFieldsCount = goalsFieldsCount;
export { goalsFieldsCount };
