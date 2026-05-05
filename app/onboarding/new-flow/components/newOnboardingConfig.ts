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
    whyWeAsk:
      'We track ballot status to personalize your timeline and task priorities. It has no effect on the questions we ask.',
  },
  {
    id: 'party-affiliation',
    eyebrow: 'Candidate eligibility',
    title: 'Are you running with an official party affiliation?',
    description:
      'Party affiliation determines whether the candidate can continue with GoodParty.org support.',
    summary:
      'Eligible candidates continue; major-party candidates will be blocked by this step implementation.',
    whyWeAsk:
      'GoodParty.org only works with non-partisan candidates or those who are independent of both major parties and big money, so they can run, win and serve empowered by our verifiably anti-corrupt platform.',
  },
  {
    id: 'office-selection',
    eyebrow: 'Office selection',
    title: 'What office are you running for?',
    description:
      'The shell tracks whether the candidate selected a structured office or manually entered an unmatched one.',
    summary:
      'Structured office selection feeds Path to Victory. Manual office entry follows a shorter path.',
    whyWeAsk:
      'Your office determines which voter data, turnout models, and path-to-victory calculations we can run for your campaign.',
  },
  {
    id: 'manual-office-entry',
    eyebrow: 'Office details',
    title: 'Enter your office manually',
    description:
      'Manual entries are kept for follow-up and skip structured-office calculations.',
    summary:
      'The manualOffice and unmatchedOffice flags are stored in onboarding state.',
    whyWeAsk:
      'We capture your office details manually so we can still generate a tailored campaign plan, even without structured election data.',
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
    whyWeAsk:
      'Knowing how many votes you need to win helps you plan your outreach intensity, budget, and timeline more precisely.',
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
    whyWeAsk:
      'Aligning your platform with your community\'s top concerns increases your chances of earning their vote and building real coalitions.',
  },
  {
    id: 'community-cares',
    eyebrow: 'Community priorities',
    title: 'What your community cares most about',
    description:
      'Community issue data appears when the flow has enough location context to request it.',
    summary:
      'Manual-office users skip this step unless ZIP-only community data is available.',
    whyWeAsk:
      'Voter issue data helps us match your positions to what residents actually care about, making your outreach more effective.',
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
    whyWeAsk:
      'Understanding where you and your community agree gives you a stronger foundation for your messaging and platform.',
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
    whyWeAsk:
      'Providing a realistic minimum budget helps set expectations and gives your campaign a concrete financial goal to plan around.',
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
    whyWeAsk:
      'The GoodParty.org pledge ensures every candidate on our platform shares a commitment to anti-corruption and independent politics.',
  },
]

export const firstNewOnboardingStepId = NEW_ONBOARDING_STEPS[0].id
