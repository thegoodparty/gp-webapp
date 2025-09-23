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
      {
        key: 'language',
        label: 'Language',
        options: [
          { key: 'languageCodes', label: 'English' },
          { key: 'languageCodes', label: 'Spanish' },
          { key: 'languageCodes', label: 'Other' },
        ],
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
      {
        key: 'registered_voter',
        label: 'Registered Voter',
        options: [
          { key: 'registeredVoterTrue', label: 'Yes' },
          { key: 'registeredVoterFalse', label: 'No' },
        ],
      },
      {
        key: 'children',
        label: 'Children',
        options: [
          { key: 'hasChildrenYes', label: 'Yes' },
          { key: 'hasChildrenNo', label: 'No' },
          { key: 'hasChildrenUnknown', label: 'Unknown' },
        ],
      },
      {
        key: 'homeowner',
        label: 'Homeowner',
        options: [
          { key: 'homeownerYes', label: 'Yes' },
          { key: 'homeownerLikely', label: 'Likely' },
          { key: 'homeownerNo', label: 'No' },
          { key: 'homeownerUnknown', label: 'Unknown' },
        ],
      },
    ],
  },
  {
    title: 'Demographic Information',
    fields: [
      {
        key: 'marital_status',
        label: 'Marital Status',
        options: [
          { key: 'married', label: 'Married' },
          { key: 'likelyMarried', label: 'Likely Married' },
          { key: 'single', label: 'Single' },
          { key: 'likelySingle', label: 'Likely Single' },
          { key: 'maritalUnknown', label: 'Unknown' },
        ],
      },
      {
        key: 'veteran_status',
        label: 'Veteran Status',
        options: [
          { key: 'veteranYes', label: 'Yes' },
          { key: 'veteranUnknown', label: 'Unknown' },
        ],
      },
      {
        key: 'business_owner',
        label: 'Business Owner',
        options: [
          { key: 'businessOwnerYes', label: 'Yes' },
          { key: 'businessOwnerUnknown', label: 'Unknown' },
        ],
      },
      {
        key: 'education',
        label: 'Level of Education',
        options: [
          { key: 'educationNone', label: 'None' },
          { key: 'educationHighSchoolDiploma', label: 'High School Diploma' },
          { key: 'educationTechnicalSchool', label: 'Technical School' },
          { key: 'educationSomeCollege', label: 'Some College' },
          { key: 'educationCollegeDegree', label: 'College Degree' },
          { key: 'educationGraduateDegree', label: 'Graduate Degree' },
          { key: 'educationUnknown', label: 'Unknown' },
        ],
      },
      {
        key: 'income_ranges',
        label: 'Household Income Range',
        options: [
          { key: 'incomeRanges', label: 'Under $25k' },
          { key: 'incomeRanges', label: '$25k - $35k' },
          { key: 'incomeRanges', label: '$35k - $50k' },
          { key: 'incomeRanges', label: '$50k - $75k' },
          { key: 'incomeRanges', label: '$75k - $100k' },
          { key: 'incomeRanges', label: '$100k - $125k' },
          { key: 'incomeRanges', label: '$125k - $150k' },
          { key: 'incomeRanges', label: '$150k - $200k' },
          { key: 'incomeRanges', label: '$200k+' },
        ],
      },
      {
        key: 'ethnicity',
        label: 'Ethnicity',
        options: [
          { key: 'ethnicityAfricanAmerican', label: 'African American' },
          { key: 'ethnicityAsian', label: 'Asian' },
          { key: 'ethnicityEuropean', label: 'European' },
          { key: 'ethnicityHispanic', label: 'Hispanic' },
          { key: 'ethnicityOther', label: 'Other' },
          { key: 'ethnicityUnknown', label: 'Unknown' },
        ],
      },
    ],
  },
]

export default filterSections
