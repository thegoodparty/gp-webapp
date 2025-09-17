const filterSections = [
  {
    title: 'General Information',
    fields: [
      {
        key: 'gender',
        label: 'Gender',
        options: [
          { key: 'genderMale', label: 'Male' },
          { key: 'genderFemale', label: 'Female' },
          { key: 'genderUnknown', label: 'Unknown' },
        ],
      },
      {
        key: 'age',
        label: 'Age',
        options: [
          { key: 'age18_25', label: '18-25' },
          { key: 'age25_35', label: '25-35' },
          { key: 'age35_50', label: '35-50' },
          { key: 'age50Plus', label: '50+' },
        ],
      },
      {
        key: 'political_party',
        label: 'Political Party',
        options: [
          { key: 'partyDemocrat', label: 'Democrat' },
          { key: 'partyIndependent', label: 'Independent' },
          { key: 'partyRepublican', label: 'Republican' },
        ],
      },
    ],
  },
  {
    title: 'Contact Information',
    fields: [
      {
        key: 'cell_phone',
        label: 'Cell Phone',
        options: [{ key: 'hasCellPhone', label: 'Has Cell Phone' }],
      },
      {
        key: 'landline',
        label: 'Landline',
        options: [{ key: 'hasLandline', label: 'Has Landline' }],
      },
    ],
  },
  {
    title: 'Voter Demographics',
    fields: [
      {
        key: 'voter_likely',
        label: 'Voter Likely',
        options: [
          { key: 'audienceFirstTimeVoters', label: 'First Time' },
          { key: 'audienceLikelyVoters', label: 'Likely' },
          { key: 'audienceSuperVoters', label: 'Super' },
          { key: 'audienceUnreliableVoters', label: 'Unreliable' },
          { key: 'audienceUnlikelyVoters', label: 'Unlikely' },
        ],
      },
    ],
  },
]

export default filterSections
