const profileFields = [
  {
    title: 'Please provide your campaign website',
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
];

export default profileFields;

let profileFieldsCount = 0;
profileFields.forEach((step) => {
  profileFieldsCount += step.fields?.length || 0;
});

profileFieldsCount = profileFieldsCount;
export { profileFieldsCount };
