const teamFields = [
  {
    title: "Let's talk about political Endorsements",
    subTitle:
      "Before reaching out to potential endorsers, it's important to do your research and identify organizations and groups that align with your campaign's platform and values. This can include labor unions, advocacy groups, community organizations, and other political entities. Make a list of these groups and take note of their mission statements and objectives to ensure that they would be a good fit for your campaign.",
    fields: [
      {
        key: 'endorsementsFriends',
        groupLabel: 'Who can endorse me and who do I want to endorse me?',
        label: 'Friends and Family',
        required: true,
        type: 'checkbox',
        noBottomMargin: true,
      },
      {
        key: 'endorsementsCommunity',
        label: 'Community leaders',
        required: true,
        type: 'checkbox',
        noBottomMargin: true,
      },
      {
        key: 'endorsementsOrg',
        label: 'Organizations',
        required: true,
        type: 'checkbox',
        noBottomMargin: true,
      },
      {
        key: 'endorsementsBusinesses',
        label: 'Businesses',
        required: true,
        type: 'checkbox',
      },
    ],
  },
  {
    title: 'Prepare your pitch',
    subTitle:
      "Once you've identified potential endorsing groups, it's time to prepare a clear and concise message about your campaign and why it's important for the endorsing group to support you. This can include a brief overview of your platform, your qualifications and experience, and what sets your campaign apart from others.",
    fields: [
      {
        key: 'preparePitch',
        label: '',
        required: true,
        type: 'text',
        rows: 6,
        enhanceAi: true,
      },
    ],
  },
  {
    title: 'Keep track of your endorsements.',
    subTitle:
      "Create a spreadsheet or document to track which groups have endorsed your campaign and their contact information. This will help you stay organized and ensure that you're not duplicating efforts.",
    fields: [
      {
        key: 'inspiration',
        label: 'Need some inspiration?',
        type: 'download',
      },
    ],
  },
  {
    title: 'Reach out to potential endorsers',
    subTitle:
      "Use email, phone, or in-person meetings to introduce yourself and your campaign, and ask for their support. Include your pitch and relevant materials, such as your campaign's website or a brochure.",
    fields: [],
  },
  {
    title: 'Did you follow up?',
    subTitle:
      'Follow up with potential endorsers to remind them of your campaign and ask if they have any questions or concerns. Remember that securing an endorsement can take time, so be patient and persistent.',
    fields: [
      {
        key: 'followUp',
        type: 'radio',
        label: 'CHECKPOINT Did you follow up with your endorsers?',
        required: true,
      },
    ],
  },
  {
    title: 'Utilize Endorsements',
    subTitle:
      'Once an endorsing group has given you an endorsement, ask if they would be willing to post your campaign information on their website, share your campaign on their social media, host a fundraiser for your campaign, allow you to speak at one of their events, allow you to use their logo on your campaign materials, introduce you to their members or other endorsers, or provide any other resources that would help your campaign.',
    fields: [
      {
        key: 'inspiration',
        label: 'Need some inspiration?',
        type: 'download',
      },
    ],
  },
  {
    title: 'Thank your endorsers',
    subTitle:
      "Remember to thank the endorsing group and keep them updated on your campaign's progress. This will help to maintain a positive relationship and increase the chances of getting more endorsements in the future.",
    fields: [],
    finalStep: true,
  },
];

export default teamFields;

let teamFieldsCount = 0;
teamFields.forEach((step) => {
  teamFieldsCount += step.fields?.length || 0;
});

teamFieldsCount = teamFieldsCount - 1;
export { teamFieldsCount };
