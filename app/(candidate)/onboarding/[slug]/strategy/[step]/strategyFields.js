const strategyFields = [
  {
    title: 'About you',
    subTitle:
      "Based on what we know about you, here's what we came up for your bio. Using our AI tools, select options to update and make it better, or click into the text and edit it yourself.",
    fields: [
      {
        key: 'aboutYou',
        label: '',
        required: true,
        type: 'text',
        rows: 6,
        enhanceAi: true,
      },
    ],
  },
  {
    title: 'Tell us about any achievements.',
    subTitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id lorem dapibus, porta lorem vitae, vehicula nisi. Aenean non congue metus. Nam vel enim.',
    fields: [
      {
        key: 'achievements',
        label: 'Achievements',
        required: true,
        type: 'text',
        rows: 4,
      },
    ],
  },

  {
    title: 'Profile with banner',
    pageType: 'profileBanner',
    subTitle: 'sub title?',
    fields: [],
  },
];

export default strategyFields;

let strategyFieldsCount = 0;
strategyFields.forEach((step) => {
  strategyFieldsCount += step.fields?.length || 0;
});

strategyFieldsCount = strategyFieldsCount + 1; // profile
export { strategyFieldsCount };
