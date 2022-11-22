import React from 'react';
import styled from 'styled-components';

import {
  FaTwitterSquare,
  FaFacebookSquare,
  FaYoutubeSquare,
  FaLinkedin,
  FaSnapchatSquare,
  FaTiktok,
  FaRedditSquare,
  FaGlobeAmericas,
  FaVideo,
} from 'react-icons/fa';
import { flatStates } from '../../../helpers/statesHelper';

const IconWrapper = styled.span`
  color: #000;
  font-size: 24px;
  margin-right: 16px;
`;

export const step2fields = [
  {
    label: 'First Name',
    key: 'firstName',
    placeholder: 'First Name',
    required: true,
    defaultValue: '',
    type: 'text',
    shortLabel: 'First name',
  },
  {
    label: 'Last Name',
    key: 'lastName',
    placeholder: 'Last Name',
    required: true,
    defaultValue: '',
    type: 'text',
    shortLabel: 'Last name',
  },
  {
    label: 'Email',
    key: 'candidateEmail',
    placeholder: 'email@domain.com',
    defaultValue: '',
    type: 'email',
    required: true,
  },
  {
    label: 'Phone',
    key: 'candidatePhone',
    placeholder: '(555) 555-5555',
    defaultValue: '',
    type: 'phone',
    required: true,
  },

  {
    label: 'Primary Residence',
    key: 'zip',
    placeholder: 'Enter Zip Code',
    required: true,
    defaultValue: '',
    type: 'text',
    shortLabel: 'ZIP code',
    maxLength: 5,
  },
  {
    label: 'U.S. Citizen',
    key: 'citizen',
    required: true,
    defaultValue: '',
    type: 'radio',
    options: ['Yes', 'No'],
    shortLabel: 'US citizenship status',
  },
  {
    label: 'Date of birth',
    key: 'dob',
    defaultValue: '',
    type: 'date',
    required: true,
  },
  {
    label: 'Political party affiliation',
    key: 'party',
    required: true,
    defaultValue: '',
    type: 'select',
    options: [
      'Independent',
      'Green Party',
      'Libertarian',
      'SAM',
      'Forward',
      'Other',
    ],
    toggleElement: 'otherParty',
  },
  {
    label: 'Other Party',
    key: 'otherParty',
    hidden: true,
  },
  {
    label: 'Previously ran for public office?',
    key: 'ranBefore',
    defaultValue: '',
    required: true,
    type: 'radio',
    options: ['Yes', 'No'],
    toggleElement: 'publicOffice',
    shortLabel: 'Public office history',
  },
  {
    key: 'publicOffice',
    hidden: true,
  },
  {
    label: 'Previously elected or appointed to public office?',
    key: 'electedBefore',
    defaultValue: '',
    required: true,
    type: 'radio',
    options: ['Yes', 'No'],
    toggleElement: 'officeElected',
    shortLabel: 'Elected for public office?',
  },
  {
    key: 'officeElected',
    hidden: true,
  },

  {
    label: 'Have you ever been a registered member of a political party?',
    key: 'memberPolitical',
    defaultValue: '',
    required: true,
    type: 'radio',
    options: ['Yes', 'No'],
    shortLabel: 'Political affiliation history',
    toggleElement: 'partyHistory',
  },

  {
    label: 'History of party affiliation?',
    key: 'partyHistory',
    defaultValue: '',
    // required: true,
    type: 'text',
    multiline: true,
    hidden: true,
  },
];

export const step2Socials = [
  {
    key: 'candidateTwitter',
    label: 'Candidate Twitter',
    adornment: 'twitter.com/',
    placeholder: 'username',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaTwitterSquare />
      </IconWrapper>
    ),
  },
  {
    key: 'candidateFacebook',
    label: 'Candidate Facebook',
    adornment: 'facebook.com/',
    placeholder: 'link',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaFacebookSquare />
      </IconWrapper>
    ),
  },
  {
    key: 'candidateYoutube',
    label: 'Candidate YouTube',
    adornment: 'youtube.com/',
    placeholder: 'username',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaYoutubeSquare />
      </IconWrapper>
    ),
  },
  {
    key: 'candidateLinkedin',
    label: 'Candidate LinkedIn',
    adornment: 'linkedin.com/',
    placeholder: 'username',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaLinkedin />
      </IconWrapper>
    ),
  },
  {
    key: 'candidateSnap',
    label: 'Candidate Snap',
    adornment: 'snap.com/',
    placeholder: 'username',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaSnapchatSquare />
      </IconWrapper>
    ),
  },
  {
    key: 'candidateTiktok',
    label: 'Candidate TikTok',
    adornment: 'tiktok.com/',
    placeholder: 'username',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaTiktok />
      </IconWrapper>
    ),
  },
  {
    key: 'candidateReddit',
    label: 'Candidate Reddit',
    adornment: 'reddit.com/',
    placeholder: 'username',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaRedditSquare />
      </IconWrapper>
    ),
  },
  {
    key: 'candidateWebsite',
    label: 'Candidate Website',
    adornment: '',
    placeholder: 'website.com',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaGlobeAmericas />
      </IconWrapper>
    ),
  },
];

export const step3Fields = [
  {
    label: 'Which public office?',
    key: 'running for',
    placeholder: 'What are you running for?',
    defaultValue: '',
    type: 'text',
    shortLabel: 'Office',
    required: true,
  },

  {
    label: 'Date of election',
    key: 'raceDate',
    defaultValue: '',
    type: 'date',
    required: true,
  },
  {
    label: 'State',
    key: 'state',
    defaultValue: '',
    type: 'select',
    options: flatStates,
    shortLabel: 'State',
    required: true,
  },
  {
    label: 'District (If applicable)',
    key: 'district',
    defaultValue: '',
    type: 'text',
    shortLabel: 'District',
  },
  {
    label: 'Campaign headline or slogan',
    key: 'headline',
    placeholder: 'headline',
    defaultValue: '',
    type: 'text',
    maxLength: 80,
    subtitle: '80 characters max',
    required: true,
  },
  {
    label: 'Campaign summary',
    key: 'campaignSummary',
    placeholder:
      'Why are you running as an independent or 3rd party candidate?',
    subtitle: 'Why are you running as an independent or 3rd party candidate?',
    defaultValue: '',
    type: 'text',
    multiline: true,
    shortLabel: 'Summary',
    required: true,
    maxLength: 5000,
  },
  {
    label: 'Campaign video (YouTube)',
    key: 'campaignVideo',
    placeholder: 'Paste link to a YouTube video...',
    subtitle:
      "A 60 second intro video about your campaign and why you're running.",
    defaultValue: '',
    type: 'youtube',
    subLabel: 'Optional',
    isYouTube: true,
  },
  {
    key: 'headshotPhoto',
    label: 'Candidate headshot',
    required: true,
    value: '',
  },
  {
    label: 'Name of candidate/campaign committee',
    key: 'committeeName',
    placeholder: 'Enter...',
    defaultValue: '',
    type: 'text',
    subLabel: 'If already filed',
    shortLabel: 'Committee name',
  },
  {
    label: 'Has candidate filed statement of candidacy?',
    key: 'candidacyStatement',
    defaultValue: '',
    type: 'radio',
    options: ['Yes', 'No'],
    shortLabel: 'Statement of candidacy history',
  },
  {
    label: 'Has candidate filed any campaign financial disclosures?',
    key: 'fecStatement',
    defaultValue: '',
    type: 'radio',
    options: ['Yes', 'No'],
    shortLabel: 'Financial statements status',
  },
  {
    label: 'Money raised so far?',
    required: true,
    key: 'moneyRaisedAmount',
    type: 'select',
    options: [
      'Less than $10,000',
      '$10,000-$50,000',
      '$50,000-$100,000',
      'More than $100,000',
    ],
  },
  {
    label: 'Is the majority of money raised from individual contributions?',
    key: 'fromWhom',
    defaultValue: '',
    type: 'radio',
    options: ['Yes', 'No'],
    required: true,
  },
  {
    label:
      'How many signatures are required for your name to appear on the ballot in your election (if applicable)?',
    key: 'signatures',
    placeholder: 'Enter...',
    defaultValue: '',
    type: 'text',
    shortLabel: 'Required Signatures',
  },
  {
    label: 'When is the filing deadline to get your name on the ballot?',
    key: 'ballotDate',
    defaultValue: '',
    type: 'date',
    required: true,
  },
  {
    label:
      'How many voters do you believe are likely to support an Independent or 3rd party candidate in your election?',
    key: 'likelySupport',
    placeholder: 'Enter...',
    defaultValue: '',
    type: 'text',
    shortLabel: 'Likely voters',
  },
  {
    label:
      'How many votes do you estimate will it take to win the elected office you are interested in running for in the General election?',
    key: 'votesToWin',
    placeholder: 'Enter...',
    defaultValue: '',
    type: 'text',
    shortLabel: 'Votes Needed',
  },

  {
    label: 'When does early voting begin in your election?',
    key: 'earlyVotingDate',
    defaultValue: '',
    type: 'date',
    required: true,
  },
];

export const step3Socials = [
  {
    key: 'twitter',
    label: 'Campaign Twitter',
    adornment: 'twitter.com/',
    placeholder: 'username',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaTwitterSquare />
      </IconWrapper>
    ),
  },
  {
    key: 'facebook',
    label: 'Campaign Facebook',
    adornment: 'facebook.com/',
    placeholder: 'link',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaFacebookSquare />
      </IconWrapper>
    ),
  },
  {
    key: 'youtube',
    label: 'Campaign YouTube',
    adornment: 'youtube.com/',
    placeholder: 'username',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaYoutubeSquare />
      </IconWrapper>
    ),
  },
  {
    key: 'linkedin',
    label: 'Campaign Linkedin',
    adornment: 'linkedin.com/',
    placeholder: 'username',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaLinkedin />
      </IconWrapper>
    ),
  },
  {
    key: 'snap',
    label: 'Campaign Snap',
    adornment: 'snap.com/',
    placeholder: 'username',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaSnapchatSquare />
      </IconWrapper>
    ),
  },
  {
    key: 'tiktok',
    label: 'Campaign TikTok',
    adornment: 'tiktok.com/',
    placeholder: 'username',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaTiktok />
      </IconWrapper>
    ),
  },
  {
    key: 'reddit',
    label: 'Campaign Reddit',
    adornment: 'reddit.com/',
    placeholder: 'username',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaRedditSquare />
      </IconWrapper>
    ),
  },
  {
    key: 'website',
    label: 'Campaign Website',
    adornment: '',
    placeholder: 'website.com',
    defaultValue: '',
    icon: (
      <IconWrapper>
        <FaGlobeAmericas />
      </IconWrapper>
    ),
  },
];

export const leftLinks = [
  { step: 1, label: '1. Good Party Pledge' },
  { step: 2, label: '2. Candidate Details' },
  { step: 3, label: '3. Campaign Details' },
  { step: 4, label: '4. Social Media' },
  { step: 5, label: '5. Top Issues' },
  { step: 6, label: '6. Key Endorsements' },
  { step: 7, label: '7. Application Checklist' },
];


const IconEmoji = styled.span`
  font-size: 20px;
  margin-right: 8px;
`;

export const APPLICATION_CARDS_1 = [
  {
    title: 'Honest',
    subtitle:
      'Good Certified candidates are committed to serving with utmost integrity, and using technology to be open, transparent and responsive representatives of the people.',
    icon: (
      <IconEmoji role="img" aria-label="honest">
        😇
      </IconEmoji>
    ),
    checkboxes: [
      {
        id: 'disAffiliate',
        text: 'I pledge to serve with the highest levels of integrity and honesty and to report and disclose to appropriate authorities (constituents, law enforcement, etc.) any attempts to unfairly influence me or members of my campaign staff within 48 hours.',
      },
      {
        id: 'notJoin',
        text: `<div>
                I pledge to serve transparently and to be accountable and responsive to the people - including to the extent possible to:
                <br/>
                <ul>
                  <li>Openly share my calendar, and to have my meetings on public time be live-streamed, closed-captioned, archived and searchable.</li>
                  <li> Allocate a reasonable portion of official and campaign resources to the technology (e.g. mobile apps, phone, body cam, Youtube, Facebook Live, etc.) necessary to do so.</li>
                  <li>Push for transparency and accountability in all government spending and accounting, including the use of technologies for such purposes.</li>
                </ul>
              </div>`,
      },
      {
        id: 'noPay',
        text: `<div>
                I pledge that, if elected, I will always work to champion or support anti-corruption policies that enable more competition and choices in elections and transparency and accountability in government - including but not limited to examples such as:
                <br/>
                <ul>
                  <li>Rank-choice voting, non-partisan primaries, ending gerrymandering, proportional representation, closing the revolving door from politics to lobbying and eliminating influence of dark money.</li>
                </ul>
              </div>`,
      },
    ],
  },

  {
    title: 'Independent',
    subtitle:
      'Good Certified candidates are not Republican or Democratic politicians. They are independent-minded people from across the political spectrum, dedicated to advancing the priorities of their constituents.',
    icon: (
      <IconEmoji role="img" aria-label="Independent">
        🗽
      </IconEmoji>
    ),
    checkboxes: [
      {
        id: 'alternative',
        text: 'I pledge to disaffiliate from the Democratic or Republican Parties and declare myself an independent or alternative party candidate for office.',
      },
      {
        id: 'fundraising',
        text: 'I pledge that, if elected, I will NOT pay membership dues or otherwise engage in fundraising for either of the two major political party committees while in office.',
      },
      {
        id: 'nopartisan',
        text: 'I pledge that, if elected, I will remain independent of partisan politics and be open to working with all sides to the benefit of my constituents.',
      },
    ],
  },

  {
    title: 'People-Powered',
    subtitle:
      'Good Certified candidates run to serve people, not corporations, unions, political action committees or special interests. They run  grass-roots campaigns that depend on being connected to and promoted by the people that they’ll be serving.\n',
    icon: (
      <IconEmoji role="img" aria-label="People-Powered">
        🙌🏼
      </IconEmoji>
    ),
    checkboxes: [
      {
        id: 'honest',
        text: 'I pledge that the majority of my support will come from living people and individual donors, NOT from corporations, unions, political action committees, or other non-living entities.',
      },
      {
        id: 'transparent',
        text: 'I pledge to run a grass-roots campaign, centered on ideas, earned media and word-of-mouth promotion, so that I’m dependent on the people, not on big-money and special interests.',
      },
      {
        id: 'choices',
        text: 'I pledge that after I’m elected I will stay connected to my constituency using technology and tools that ensure my decisions on important issues and legislation are informed by their best ideas and interests. ',
      },
    ],
  },
];
