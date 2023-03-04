const socialFields = [
  {
    title: 'Your social media presence',
    subTitle:
      "Your social media presence is your first impression to many voters (and most young voters), so it's important that you put effort into aligning your presence with the values of your campaign. You want a presence that helps you reach the people you need and that makes you come across as to make you look competent and relatable.",
    fields: [],
  },
  {
    title: "First, let's build your brand",
    subTitle:
      "Building your brand and deciding how you're going to present yourself online is a crucial part of your campaign . Let us help you build your social media presence!",
    fields: [
      {
        key: 'brand',
        label: 'Find your niche',
        placeholder: "Make a list of communities you're a part of",
        required: true,
        type: 'text',
        rows: 4,
      },
    ],
  },
  {
    title: "Great. Now let's find your authentic voice",
    subTitle:
      "It's important to project your authentic voice! Don't feel the need to seem too “polished” or hide things that might be a turnoff in the two-party system.",
    fields: [
      {
        key: 'voice',
        label: 'Find your voice',
        placeholder:
          'Make some notes about your online voice: Examples: Volunteer organizations, church groups, fandoms, etc.',
        required: true,
        type: 'text',
        rows: 4,
      },
    ],
  },
  {
    title: "Now it's time to set up your accounts",
    subTitle:
      'Determine your channels - Below are the major social media channels that you will likely want to have a presence on. Click on each to learn more about how to use them and see useful examples.',
    fields: [],
  },
  {
    title: 'Clean up your existing accounts',
    subTitle:
      "Go through all of your current accounts and update them so you'e ready with a clean slate. Once you've done all of these steps, move on to the next step.",
    fields: [
      {
        key: 'privacySettings',
        label: (
          <>
            <strong>Adust privacy settings</strong>
            <div>
              Anything you don&apos;t want associated with your campaign should
              be turned private
            </div>
          </>
        ),
        required: true,
        type: 'checkbox',
        noBottomMargin: true,
      },
      {
        key: 'deleteContent',
        label: (
          <>
            <strong>Delete content </strong>
            <div>Delete photos, posts, etc. that could get you in trouble</div>
          </>
        ),
        required: true,
        type: 'checkbox',
        noBottomMargin: true,
      },
    ],
  },
  {
    title: 'Get verified to run political ads',
    subTitle: '',
    fields: [],
  },
  {
    title: 'Nice! You unlocked a session with Colton!',
    subTitle: '',
    fields: [],
  },
];

export default socialFields;

let socialFieldsCount = 0;
socialFields.forEach((step) => {
  socialFieldsCount += step.fields?.length || 0;
});

socialFieldsCount = socialFieldsCount - 1;
export { socialFieldsCount };
