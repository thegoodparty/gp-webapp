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
      'We tailor your strategy to where you actually are in your campaign.',
    summary:
      'The answer is stored in onboarding state and can be submitted with the final payload.',
    whyWeAsk:
      'Party affiliation determines whether the candidate can continue with GoodParty.org support.',
    isValid: ({ answers }) => Boolean(answers.ballotStatus),
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
    isValid: ({ answers }) =>
      answers.partyAffiliation === 'nonpartisan' ||
      answers.partyAffiliation === 'independent-or-non-major',
  },
  {
    id: 'office-selection',
    eyebrow: 'Office selection',
    title: 'What office are you running for?',
    description:
      "We'll use this to analyze local voter data, trends, & news to create your campaign plan.",
    summary:
      'Structured office selection feeds Path to Victory. Manual office entry follows a shorter path.',
    whyWeAsk:
      "We use this to find the district you're running in, pull registered voter data, historical voter turnout, partisan data, and local issues to build your campaign plan.",
    isValid: ({ answers }) =>
      Boolean(answers.structuredOffice) || answers.officePath === 'manual',
  },
  {
    id: 'manual-office-entry',
    eyebrow: 'Office details',
    title: 'Tell us about your office',
    description:
      "We couldn't find a structured match. Enter your office details and our team will follow up.",
    summary:
      'The manualOffice and unmatchedOffice flags are stored in onboarding state.',
    whyWeAsk:
      'We capture your office details manually so we can still generate a tailored campaign plan, even without structured election data.',
    shouldSkip: ({ answers }) => answers.officePath !== 'manual',
    isValid: ({ answers }) => {
      const f = answers.manualOfficeForm
      if (!f) return false
      return Boolean(
        f.office && f.state && f.city && f.officeTermLength && f.electionDate,
      )
    },
  },
  {
    id: 'path-to-victory',
    eyebrow: 'Vote goal',
    title: "Here's how many votes you need to win",
    description:
      'We use historical voter data and proprietary models to get the most accurate projections for your race.',
    summary:
      'Manual-office users skip this step because the required structured election data is unavailable.',
    whyWeAsk:
      "Most candidates think they need to convince everyone. You don't. You need to find your win number, talk to them, and make sure they vote. We'll show you exactly what that takes.",
    shouldSkip: ({ answers }) => answers.officePath === 'manual',
  },
  {
    id: 'voter-demographics',
    eyebrow: 'Voter demographics',
    title: "Here's everything to know about your voters",
    description:
      'We crunch the latest voter data, along with proprietary behavior models, to give you a snapshot of who lives, votes, and pays attention in your community.',
    summary:
      'Voter demographic charts are rendered from the structured-office district stats.',
    whyWeAsk:
      'We use this data to help you understand what voters care most about, and to customize your campaign plan.',
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
