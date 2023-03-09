const strategyFields = [
  {
    title: 'Tell us about any achievements.',
    subTitle:
      'Give voters a chance to learn more about your accomplishments and what makes you stand out as a candidate. Tell us about any achievements or notable experiences that demonstrate your leadership abilities, dedication to public service, and commitment to improving our community. This could include awards, recognitions, community involvement, or any other accomplishments that showcase your skills and qualifications.',
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
    title: 'About You',
    subTitle:
      "Based on what we know about you so far, here's what the Good Party AI tool thinks your ABOUT statement might be:",
    pageType: 'AIFlow',
    fields: [
      {
        key: 'aboutStatement',
        initialQuestion: 'Tell me what a good about statement might look like',
      },
    ],
  },
];

export default strategyFields;

let strategyFieldsCount = 0;
strategyFields.forEach((step) => {
  strategyFieldsCount += step.fields?.length || 0;
});

// strategyFieldsCount = strategyFieldsCount + 1; // profile
export { strategyFieldsCount };
