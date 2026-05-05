import type { NewOnboardingStep, NonEmptyArray } from './newOnboardingTypes'

export const NEW_ONBOARDING_STEPS: NonEmptyArray<NewOnboardingStep> = [
  {
    id: 'welcome',
    eyebrow: 'Campaign plan setup',
    title: "Let's build your winning campaign plan in 5 mins",
    description:
      "All we need to know is what office you're running for and where, and we'll take it from there",
    summary:
      'This step introduces the value of the flow before collecting candidate details.',
  },
  {
    id: 'ballot-status',
    eyebrow: 'Candidate status',
    title: 'Are you already on the ballot?',
    description:
      'Ballot status is captured for internal context without changing the flow path.',
    summary:
      'The answer is stored in onboarding state and can be submitted with the final payload.',
  },
  {
    id: 'party-affiliation',
    eyebrow: 'Candidate eligibility',
    title: 'Are you running with an official party affiliation?',
    description:
      'Party affiliation determines whether the candidate can continue with GoodParty.org support.',
    summary:
      'Eligible candidates continue; major-party candidates will be blocked by this step implementation.',
  },
  {
    id: 'office-selection',
    eyebrow: 'Office selection',
    title: 'What office are you running for?',
    description:
      'The shell tracks whether the candidate selected a structured office or manually entered an unmatched one.',
    summary:
      'Structured office selection feeds Path to Victory. Manual office entry follows a shorter path.',
  },
  {
    id: 'manual-office-entry',
    eyebrow: 'Office details',
    title: 'Enter your office manually',
    description:
      'Manual entries are kept for follow-up and skip structured-office calculations.',
    summary:
      'The manualOffice and unmatchedOffice flags are stored in onboarding state.',
    shouldSkip: ({ answers }) => answers.officePath !== 'manual',
  },
  {
    id: 'path-to-victory',
    eyebrow: 'Vote goal',
    title: 'Building your path to victory',
    description:
      'Structured-office candidates can see vote calculations once office data is available.',
    summary:
      'Manual-office users skip this step because the required structured election data is unavailable.',
    shouldSkip: ({ answers }) => answers.officePath === 'manual',
  },
  {
    id: 'candidate-issues',
    eyebrow: 'Candidate priorities',
    title: 'What are the most important issues to you?',
    description:
      'Candidate-selected issues are stored for alignment and future campaign plan personalization.',
    summary:
      'This step remains available to both structured-office and manual-office users.',
  },
  {
    id: 'community-cares',
    eyebrow: 'Community priorities',
    title: 'What your community cares most about',
    description:
      'Community issue data appears when the flow has enough location context to request it.',
    summary:
      'Manual-office users skip this step unless ZIP-only community data is available.',
    shouldSkip: ({ answers }) =>
      answers.officePath === 'manual' &&
      answers.hasZipOnlyCommunityData !== true,
  },
  {
    id: 'community-alignment',
    eyebrow: 'Issue alignment',
    title: 'Where you and your community align',
    description:
      'Candidate and community priorities are compared before the final effort estimate.',
    summary:
      'Manual-office users skip this step unless ZIP-only community data is available.',
    shouldSkip: ({ answers }) =>
      answers.officePath === 'manual' &&
      answers.hasZipOnlyCommunityData !== true,
  },
  {
    id: 'minimum-budget',
    eyebrow: 'Campaign effort',
    title: "Here's the minimum budget required",
    description:
      'Structured-office candidates can see the campaign effort estimates once calculations are ready.',
    summary:
      'Manual-office users skip this step because structured calculations are unavailable.',
    shouldSkip: ({ answers }) => answers.officePath === 'manual',
  },
  {
    id: 'pledge',
    eyebrow: 'Final step',
    title: 'Agree to the GoodParty.org pledge',
    description:
      'Both onboarding paths end at the pledge before routing to the regular dashboard.',
    summary:
      'The final payload keeps collected answers available for future integrations.',
  },
]

export const firstNewOnboardingStepId = NEW_ONBOARDING_STEPS[0].id
