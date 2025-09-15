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
          { key: 'politicalPartyDemocrat', label: 'Democrat' },
          { key: 'politicalPartyNonPartisan', label: 'Non Partisan' },
          { key: 'politicalPartyRepublican', label: 'Republican' },
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
          { key: 'voterLikelyFirstTime', label: 'First Time' },
          { key: 'voterLikelyLikely', label: 'Likely' },
          { key: 'voterLikelySuper', label: 'Super' },
          { key: 'voterLikelyUnknown', label: 'Unknown' },
        ],
      },
    ],
  },
]

export default filterSections
