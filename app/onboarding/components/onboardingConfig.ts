import type { OnboardingStepConfig, NonEmptyArray } from './onboardingTypes'

export const ONBOARDING_STEPS: NonEmptyArray<OnboardingStepConfig> = [
  {
    id: 'welcome',
    eyebrow: 'Campaign plan setup',
    title: "Let's build your winning campaign plan in 5 minutes",
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
      'Knowing whether you’re already on the ballot lets us tailor your timeline and the next steps in your campaign plan.',
    isValid: ({ answers }) => Boolean(answers.ballotStatus),
  },
  {
    id: 'party-affiliation',
    eyebrow: 'Candidate eligibility',
    title: 'Are you running with an official party designation?',
    description:
      'Party designation determines whether you can continue with GoodParty.org support.',
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
      const validTermLengths = ['2 years', '3 years', '4 years', '6 years']
      if (
        !(
          f.office &&
          f.state &&
          f.city &&
          f.officeTermLength &&
          validTermLengths.includes(f.officeTermLength) &&
          f.electionDate
        )
      ) {
        return false
      }
      const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(f.electionDate)
      const parsed = match
        ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
        : new Date(f.electionDate)
      if (Number.isNaN(parsed.getTime())) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      parsed.setHours(0, 0, 0, 0)
      return parsed >= today
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
    title: 'Take our pledge to get your campaign plan',
    description:
      'We only work with candidates who are independent of both major parties, big-money influence, and are anti-corruption.',
    summary:
      'The final payload keeps collected answers available for future integrations.',
  },
]

export const firstOnboardingStepId = ONBOARDING_STEPS[0].id
