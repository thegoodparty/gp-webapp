export interface MockPlanSection {
  id: string
  title: string
  body: string
}

export const MOCK_PLAN_SECTIONS: MockPlanSection[] = [
  {
    id: 'race-overview',
    title: 'Race overview',
    body: 'A snapshot of the seat you are running for: jurisdiction, term length, and the size of the electorate. We use this to size every other recommendation in your plan.',
  },
  {
    id: 'path-to-victory',
    title: 'Path to victory',
    body: 'Your win number, projected turnout, and voter contact goal. Hit these and you win on paper. The rest of this plan is how to hit them in practice.',
  },
  {
    id: 'message-and-issues',
    title: 'Message and issues',
    body: 'The three issues your voters care most about, paired with the one-sentence pitch you can deliver at any door, any debate, or any coffee shop.',
  },
  {
    id: 'outreach',
    title: 'Outreach plan',
    body: 'How you will reach enough voters before Election Day: doors, calls, texts, mail, and digital. Each channel is sized to the universe and budget you told us about.',
  },
  {
    id: 'budget',
    title: 'Budget',
    body: 'A line-item estimate of what this campaign costs: filing fee, compliance, voter contact, and signage. Use it as a fundraising target, not a ceiling.',
  },
  {
    id: 'timeline',
    title: 'Timeline',
    body: 'Week-by-week milestones from today through Election Day. We will keep this updated as your race evolves.',
  },
]
