import { flatStates } from 'helpers/statesHelper';

export const fields = [
  { label: 'First Name', key: 'firstName', required: true },
  { label: 'Last Name', key: 'lastName', required: true },
  { label: 'Zip Code', key: 'zip' },

  {
    label: 'YouTube (this will be the hero video on your page)',
    key: 'youtube',
    isUrl: true,
  },
  { label: 'Twitter', key: 'twitter', isUrl: true },
  { label: 'Facebook', key: 'facebook', isUrl: true },
  { label: 'LinkedIn', key: 'linkedin', isUrl: true },
  { label: 'Snap', key: 'snap', isUrl: true },
  { label: 'TikTok', key: 'tiktok', isUrl: true },
  { label: 'Instagram', key: 'instagram', isUrl: true },
  { label: 'Twitch', key: 'twitch', isUrl: true },
  { label: 'Website', key: 'website', isUrl: true },
];

export const fields2 = [
  {
    label: 'Political party affiliation',
    key: 'party',
    type: 'select',
    options: ['I', 'GP', 'L', 'W', 'F', 'U', 'Other'],
    required: true,
  },

  { label: 'Other Party', key: 'otherParty', isHidden: true },
  {
    label: 'State ',
    key: 'state',
    columns: 'col-span-6',
    type: 'select',
    options: flatStates,
    required: true,
  },
  {
    label: 'Office ',
    key: 'office',
    columns: 'col-span-6',
    type: 'select',
    withGroups: true,
    options: [
      {
        group: 'Federal',
        options: ['President', 'US Senate', 'US House of Representatives'],
      },
      {
        group: 'State',
        options: [
          'Governor',
          'Lieutenant Governor',
          'Attorney General',
          'Comptroller',
          'Treasurer',
          'Secretary of State',
          'State Supreme Court Justice',
          'State Senate',
          'State House of Representatives',
        ],
      },
      {
        group: 'Local',
        options: [
          'County Executive',
          'Mayor',
          'District Attorney',
          'Sheriff',
          'Clerk',
          'Auditor',
          'Public Administrator',
          'Judge',
          'County Commissioner',
          'Council Member',
          'School Board',
        ],
      },
    ],
    required: true,
  },
  {
    label: 'District (if applicable)',
    columns: 'col-span-6',
    key: 'district',
    type: 'number',
  },
  {
    label: 'Counties served',
    key: 'counties',
    columns: 'col-span-6',
  },
  {
    label: 'Date of election ',
    key: 'raceDate',
    isDate: true,
    required: true,
  },
  {
    label: 'Ballot filing deadline ',
    key: 'ballotDate',
    isDate: true,
    columns: 'col-span-6',
  },
  {
    label: 'Early voting date',
    key: 'earlyVotingDate',
    isDate: true,
    columns: 'col-span-6',
  },
  { label: 'Headline', key: 'headline', required: true },
  { label: 'Summary', key: 'about', isRichText: true, required: true },
  { label: 'Committee name', key: 'committeeName' },
  {
    label: 'Campaign Video (YouTube Id)',
    key: 'heroVideo',
    type: 'youtubeInput',
  },

  { label: 'Why I am running', key: 'whyRunning' },
  { label: 'Why I am an independent', key: 'whyIndependent' },
  { label: 'Prior experience', key: 'experience' },

  { label: 'Home Town & State', key: 'hometown' },
  { label: 'Current occupation', key: 'occupation' },
  { label: 'Fun fact', key: 'funFact' },
];

export const fields3 = [
  { label: 'First Name ', key: 'contactFirstName' },
  { label: 'Last Name ', key: 'contactLastName' },
  { label: 'Email ', key: 'contactEmail', type: 'email' },
  { label: 'Phone ', key: 'contactPhone', type: 'phone' },
];

export const panels = [
  { fields, label: 'Candidate Information' },
  { fields: fields2, label: 'Campaign Information' },
  { fields: fields3, label: 'Contact Information' },
];
