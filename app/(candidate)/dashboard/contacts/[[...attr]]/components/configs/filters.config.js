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
        key: 'address',
        label: 'Address',
        options: [
          { key: 'hasAddress', label: 'Has Address' },
          { key: 'addressNotListed', label: 'Address Not Listed' },
        ],
      },
      {
        key: 'cell_phone',
        label: 'Cell Phone',
        options: [
          { key: 'hasCellPhone', label: 'Has Cell Phone' },
          { key: 'cellPhoneNotListed', label: 'Cell Phone Not Listed' },
        ],
      },
      {
        key: 'landline',
        label: 'Landline',
        options: [
          { key: 'hasLandline', label: 'Has Landline' },
          { key: 'landlineNotListed', label: 'Landline Not Listed' },
        ],
      },
      {
        key: 'email',
        label: 'Email',
        options: [
          { key: 'hasEmail', label: 'Has Email' },
          { key: 'emailNotListed', label: 'Email Not Listed' },
        ],
      },
    ],
  },
  {
    title: 'Voter Demographics',
    fields: [
      {
        key: 'registered_voter',
        label: 'Registered Voter',
        options: [
          { key: 'registeredVoterYes', label: 'Yes' },
          { key: 'registeredVoterNo', label: 'No' },
        ],
      },
      {
        key: 'active_voter',
        label: 'Active Voter',
        options: [
          { key: 'activeVoterYes', label: 'Yes' },
          { key: 'activeVoterNo', label: 'No' },
        ],
      },
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
  {
    title: 'Demographic Information',
    fields: [
      {
        key: 'marital_status',
        label: 'Marital Status',
        options: [
          { key: 'maritalStatusMarried', label: 'Married' },
          { key: 'maritalStatusLikelyMarried', label: 'Likely Married' },
          { key: 'maritalStatusSingle', label: 'Single' },
          { key: 'maritalStatusLikelySingle', label: 'Likely Single' },
          { key: 'maritalStatusUnknown', label: 'Unknown' },
        ],
      },
      {
        key: 'has_children',
        label: 'Has Children Under 18',
        options: [
          { key: 'hasChildrenNo', label: 'No' },
          { key: 'hasChildrenYes', label: 'Yes' },
          { key: 'hasChildrenUnknown', label: 'Unknown' },
        ],
      },
      {
        key: 'veteran_status',
        label: 'Veteran Status',
        options: [
          { key: 'veteranStatusYes', label: 'Yes' },
          { key: 'veteranStatusNo', label: 'No' },
          { key: 'veteranStatusUnknown', label: 'Unknown' },
        ],
      },
      {
        key: 'business_owner',
        label: 'Business Owner',
        options: [
          { key: 'businessOwnerYes', label: 'Yes' },
          { key: 'businessOwnerLikely', label: 'Likely' },
          { key: 'businessOwnerNo', label: 'No' },
          { key: 'businessOwnerUnknown', label: 'Unknown' },
        ],
      },
      {
        key: 'education',
        label: 'Education',
        options: [
          { key: 'educationHighSchool', label: 'High School' },
          { key: 'educationSomeCollege', label: 'Some College' },
          { key: 'educationTechnicalSchool', label: 'Technical School' },
          { key: 'educationSomeCollegeDegree', label: 'Some College Degree' },
          { key: 'educationCollegeDegree', label: 'College Degree' },
          { key: 'educationGraduateDegree', label: 'Graduate Degree' },
          { key: 'educationUnknown', label: 'Unknown' },
        ],
      },
      {
        key: 'household_income',
        label: 'Household Income',
        options: [
          { key: 'householdIncome15_25k', label: '$15 - $25k' },
          { key: 'householdIncome25_35k', label: '$25 - $35k' },
          { key: 'householdIncome35_50k', label: '$35k - $50k' },
          { key: 'householdIncome50_75k', label: '$50k - $75k' },
          { key: 'householdIncome75_100k', label: '$75k - $100k' },
          { key: 'householdIncome100_125k', label: '$100k - $125k' },
          { key: 'householdIncome125_150k', label: '$125k - $150k' },
          { key: 'householdIncome150_175k', label: '$150k - $175k' },
          { key: 'householdIncome175_200k', label: '$175k - $200k' },
          { key: 'householdIncome200_250k', label: '$200k - $250k' },
          { key: 'householdIncome250kPlus', label: '$250k +' },
          { key: 'householdIncomeUnknown', label: 'Unknown' },
        ],
      },
      {
        key: 'language',
        label: 'Language',
        options: [
          { key: 'languageEnglish', label: 'English' },
          { key: 'languageSpanish', label: 'Spanish' },
          { key: 'languageOther', label: 'Other' },
        ],
      },
      {
        key: 'ethnicity',
        label: 'Ethnicity',
        options: [
          { key: 'ethnicityCaucasian', label: 'Caucasian' },
          { key: 'ethnicityAfricanAmerican', label: 'African American' },
          { key: 'ethnicityAsian', label: 'Asian' },
          { key: 'ethnicityEuropean', label: 'European' },
          { key: 'ethnicityHispanic', label: 'Hispanic' },
          { key: 'ethnicityUnknown', label: 'Unknown' },
        ],
      },
    ],
  },
]

export default filterSections
