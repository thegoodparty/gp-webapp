const goalsFields = [
  {
    title: "What's the date of election?",
    skipable: true,
    skipLabel: "I don't know",
    fields: [
      {
        key: 'electionDate',
        label: 'Date of Election',
        type: 'date',
        validate: 'futureDateOnly',
      },
    ],
  },
  {
    title: 'Campaign Website',
    skipable: true,
    fields: [
      {
        key: 'campaignWebsite',
        label: 'Campaign website',
        type: 'text',
        validate: 'url',
        helperText: 'Please provide a full url starting with http',
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
        key: 'runningAgainst',
        label: 'runningAgainst',
        type: 'text',
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
