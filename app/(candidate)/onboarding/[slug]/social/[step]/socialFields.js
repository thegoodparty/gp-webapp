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
    title:
      "You've scheduled your session with Colton! Let's keep building your community.",
    subTitle:
      "Now it's time to grow your audience and build your hype army - these are the people who are going to help you win your campaign!",
    pageType: 'checklist',
    fields: [
      {
        title: 'Build your hype army',
        content:
          'Finding an "army" of online supporters can help you hype up your social media posts and reach a wider audience. Look for and engage with communities that align with your interests and supporters of value-aligned campaigns. This will likely initially be a small group of close friends and supporters. It can start off as a group text where you drop new content when you post if for them to go like, comment and share. Be sure to continue to bring in more supporters to this group.',
      },
      {
        title: 'Supporter outreach',
        content:
          "If you're launching new social accounts or re-engaging with existing ones, text and email your supporters with links to your accounts. This is a quick and easy way to gain an initial following and increase visibility and credibility. Encourage supporters to share your content and page with their friends. Remember to keep messages short and sweet, with links and a clear call to action to follow your accounts.",
      },
      {
        title: 'Community engagement',
        content:
          'Decide how you want to engage with people in your comments sections. Decide how much bandwidth your campaign has to respond to posts. Responding to supporters makes them more likely to want to support you. You can also decide whether you want to engage with negative comments/trolls or not, or whether you want to delete those comments. Deleting comments can sometimes backfire, so unless there are explicitly abusive comments that you plan to report, avoid deleting too many comments.',
      },
      {
        title: 'Get emails & phone numbers',
        content:
          'Having a follower on social media is important, but having their contact information is even more valuable. Find ways to capture email addresses and phone numbers of your followers so you can add them to your email and text list, whether by driving them to sign up on your site on a post or DMing them directly. Having more than one way to contact supporters reduces risk to your campaign in case you get suspended or banned on any platform.',
      },
      {
        title: 'Find your true fans',
        content:
          'Your biggest supporters are your biggest asset. When you see someone repeatedly commenting on, liking, or sharing your content, reach out to them via DM and thank them for their support. If you have time, see if you can hop on a call to thank them or even ask for more support, whether that is a donation or volunteer opportunity.',
      },
    ],
  },
];

export default socialFields;

let socialFieldsCount = 0;
socialFields.forEach((step) => {
  socialFieldsCount += step.fields?.length || 0;
});

socialFieldsCount = socialFieldsCount - 1;
export { socialFieldsCount };
