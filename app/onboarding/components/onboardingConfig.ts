import type { OnboardingStepConfig, NonEmptyArray } from './onboardingTypes'

export const ONBOARDING_STEPS: NonEmptyArray<OnboardingStepConfig> = [
  {
    id: 'welcome',
    title: "Let's build your winning campaign plan in 5 minutes",
    description:
      "All we need to know is what office you're running for. We'll take it from there.",
  },
  {
    id: 'ballot-status',
    title: 'Are you already on the ballot?',
    description:
      'We tailor your strategy to where you actually are in your campaign.',
    whyThisMatters:
      'Knowing whether you’re already on the ballot lets us tailor your timeline and the next steps in your campaign plan.',
    isValid: ({ answers }) => Boolean(answers.ballotStatus),
  },
  {
    id: 'party-affiliation',
    title: 'Are you running with a party designation?',
    description:
      'Pick the party label voters would see on their official ballots for you as a candidate, not your personal voting history or party preference.',
    whyThisMatters:
      'GoodParty.org only works with non-partisan candidates or those who are independent of both major parties and big money, so they can run, win and serve empowered by our verifiably anti-corrupt platform.',
    isValid: ({ answers }) =>
      answers.partyAffiliation === 'nonpartisan' ||
      answers.partyAffiliation === 'independent-or-non-major',
  },
  {
    id: 'office-selection',
    title: 'What office are you running for?',
    description:
      "We'll use this to pull local voter data and shape your plan around your race.",
    whyThisMatters:
      "We use this to find the district you're running in, pull registered voter data, historical voter turnout, partisan data, and local issues to build your campaign plan.",
    isValid: ({ answers }) =>
      Boolean(answers.structuredOffice) || answers.officePath === 'manual',
  },
  {
    id: 'manual-office-entry',
    title: 'Tell us about your office',
    description:
      "We couldn't find a structured match. Enter your office details and our team will follow up.",
    whyThisMatters:
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
    title: 'Projected votes needed to win',
    description:
      'We use historical voter data and proprietary models to get the most accurate projections for your race.',
    whyThisMatters:
      "Most candidates think they need to convince everyone. You don't. You need to find your win number, talk to them, and make sure they vote. We'll show you exactly what that takes.",
    shouldSkip: ({ answers }) => answers.officePath === 'manual',
  },
  {
    id: 'voter-demographics',
    title: 'Voter insights for your district',
    description:
      'We use survey and voter data along with your district demographics to project likely top issues for your race.',
    whyThisMatters:
      'We use this data to help you understand what voters care most about, and to customize your campaign plan.',
    shouldSkip: ({ answers }) => answers.officePath === 'manual',
  },
  {
    id: 'pledge',
    title: 'Almost there...',
    description: 'Take our pledge to get your campaign plan.',
  },
]

export const firstOnboardingStepId = ONBOARDING_STEPS[0].id
