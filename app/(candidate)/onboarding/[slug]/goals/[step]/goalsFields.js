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
  // {
  //   title: (
  //     <>
  //       Messaging Strategy
  //       <br />
  //       What they&apos;ll say about us
  //     </>
  //   ),
  //   subTitle:
  //     "What the politicos call a 4 way messaging box. Learn what you should say about yourself and what your competition will try to say about you. Don't worry we'll save this for you to review at your leisure.",
  //   pageType: 'AIFlow',
  //   fields: [
  //     {
  //       key: 'theyAboutUs',
  //       initialQuestion: "What they'll say about us",
  //     },
  //   ],
  // },
  // {
  //   title: (
  //     <>
  //       Messaging Strategy
  //       <br />
  //       What they&apos;ll say about themselves
  //     </>
  //   ),
  //   subTitle:
  //     "What the politicos call a 4 way messaging box. Learn what you should say about yourself and what your competition will try to say about you. Don't worry we'll save this for you to review at your leisure.",
  //   pageType: 'AIFlow',
  //   fields: [
  //     {
  //       key: 'theyAboutThemselves',
  //       initialQuestion: "What they'll say about us",
  //     },
  //   ],
  // },
  // {
  //   title: (
  //     <>
  //       Messaging Strategy
  //       <br />
  //       What they&apos;ll say about us
  //     </>
  //   ),
  //   subTitle:
  //     "What the politicos call a 4 way messaging box. Learn what you should say about yourself and what your competition will try to say about you. Don't worry we'll save this for you to review at your leisure.",
  //   pageType: 'AIFlow',
  //   fields: [
  //     {
  //       key: 'theyAboutThemselves',
  //       initialQuestion: "What they'll say about us",
  //     },
  //   ],
  // },
  // {
  //   title: (
  //     <>
  //       Messaging Strategy
  //       <br />
  //       What we&apos;ll say about them
  //     </>
  //   ),
  //   subTitle:
  //     "What the politicos call a 4 way messaging box. Learn what you should say about yourself and what your competition will try to say about you. Don't worry we'll save this for you to review at your leisure.",
  //   pageType: 'AIFlow',
  //   fields: [
  //     {
  //       key: 'weAboutThem',
  //       initialQuestion: "What they'll say about us",
  //     },
  //   ],
  // },
  // {
  //   title: (
  //     <>
  //       Messaging Strategy
  //       <br />
  //       What we&apos;ll say about them
  //     </>
  //   ),
  //   subTitle:
  //     "What the politicos call a 4 way messaging box. Learn what you should say about yourself and what your competition will try to say about you. Don't worry we'll save this for you to review at your leisure.",
  //   pageType: 'AIFlow',
  //   fields: [
  //     {
  //       key: 'weAboutOurself',
  //       initialQuestion: "What they'll say about us",
  //     },
  //   ],
  // },
];

export default goalsFields;

let goalsFieldsCount = 0;
goalsFields.forEach((step) => {
  goalsFieldsCount += step.fields?.length || 0;
});

goalsFieldsCount = goalsFieldsCount;
export { goalsFieldsCount };
