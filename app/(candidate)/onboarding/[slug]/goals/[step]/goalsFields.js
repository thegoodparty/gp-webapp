const goalsFields = [
  {
    title: "Great to meet you [[NAME]]! What's your phone number?",
    fields: [
      {
        key: 'phone',
        label: 'Phone Number',
        required: true,
        type: 'phone',
      },
    ],
  },
  {
    title: "Great! What's your zip code?",
    fields: [
      {
        key: 'zip',
        label: 'Zip Code',
        required: true,
        type: 'text',
      },
    ],
  },
  {
    title: 'Are you a US Citizen?',
    fields: [
      {
        key: 'citizen',
        label: '',
        required: true,
        type: 'radio',
        options: ['Yes', 'No'],
      },
    ],
  },
  {
    title: 'What is your date of birth?',
    fields: [
      {
        key: 'dob',
        label: 'Date of Birth',
        required: true,
        type: 'date',
      },
    ],
  },
];

export default goalsFields;
