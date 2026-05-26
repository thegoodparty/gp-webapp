export type AnswerOption = {
  id: string
  label: string
  impact: string
  spawn?: SeedSuggestion
  followUp?: {
    label: string
    placeholder?: string
    prefix?: string
    actionLabel?: string
  }
  followUpChoice?: {
    label: string
    options: Array<{ id: string; label: string; impact: string }>
  }
}

export type Question = {
  id: string
  prompt: string
  detail?: string
  role: Role
  multiSelect?: boolean
  options: AnswerOption[]
}

export type Role =
  | 'field'
  | 'political'
  | 'comms'
  | 'finance'
  | 'manager'

export type SeedSuggestion = {
  id: string
  title: string
  body: string
  source: 'preset' | 'answer' | 'validation'
  role: Role
  action?: { label: string; href: string }
}

export type Preset = {
  id: string
  label: string
  audience: string
  rationale: string
  questions: Question[]
  seedSuggestions: SeedSuggestion[]
}

const firstTwoWeeks: Preset = {
  id: 'first-two-weeks',
  label: 'First two weeks',
  audience: 'Brand new candidates in their first two weeks on the platform.',
  rationale:
    "You're early in the campaign, so we're focused on three things: how much time you can give this week, whether you've talked to voters in person yet, and where you feel least confident. Each answer either reshapes the tasks we surface or points you at an Academy lesson built for this stage.",
  questions: [
    {
      id: 'hours-this-week',
      prompt: 'How many hours can you put in the next 7 days?',
      role: 'field',
      options: [
        {
          id: '0-2',
          label: '0–2',
          impact: "Noted. We'll scale down this week's task list so nothing feels impossible.",
          spawn: {
            id: 'pick-one-task',
            title: 'Pick one high-impact thing this week',
            body: 'With limited hours, focus matters. We narrowed your task list to the single highest-leverage move for this stage.',
            source: 'answer',
            role: 'manager',
            action: { label: 'See the task', href: '/dashboard' },
          },
        },
        {
          id: '3-5',
          label: '3–5',
          impact: 'Standard volume noted. Your default weekly task density looks right.',
        },
        {
          id: '6-10',
          label: '6–10',
          impact: "Higher availability noted. We'll surface a stretch outreach goal for the week.",
        },
        {
          id: '10+',
          label: '10+',
          impact: 'Power-user pace. Daily door-knocking targets unlocked on your dashboard.',
        },
      ],
    },
    {
      id: 'voter-contact-history',
      prompt: 'Have you talked to voters in person yet?',
      role: 'field',
      options: [
        {
          id: 'not-yet',
          label: 'Not yet',
          impact: "Door-knocking is the highest ROI thing you can do right now. We're connecting you with candidates who have done it.",
          spawn: {
            id: 'door-knock-circle',
            title: 'Join the door-knocking thread in Community',
            body: "Real candidates trade scripts, route tips, and what to do when nobody's home. Drop into the thread and ask your first question.",
            source: 'answer',
            role: 'field',
            action: {
              label: 'Open Community',
              href: 'https://goodpartyorg.circle.so/join?invitation_token=ee5c167c12e1335125a5c8dce7c493e95032deb7-a58159ab-64c4-422a-9396-b6925c225952',
            },
          },
        },
        {
          id: 'a-few',
          label: 'A few',
          impact: "Good start. The next lever is volume, not technique — keep going.",
        },
        {
          id: 'dozens',
          label: 'Dozens',
          impact: "You're ahead of schedule. We'll suggest tracking and follow-up tools next.",
        },
        {
          id: 'hundreds',
          label: 'Hundreds',
          impact: 'Strong. Voter Records is unlocked for you so you can organize what you have.',
        },
      ],
    },
    {
      id: 'candidate-strengths',
      prompt: 'What is your focus this week? Pick all that apply.',
      role: 'political',
      multiSelect: true,
      options: [
        {
          id: 'speaking',
          label: 'Public speaking',
          impact: "Candidate forums and town halls moved up your task list.",
        },
        {
          id: 'writing',
          label: 'Writing & messaging',
          impact: "Stump speech and op-ed templates will lean on your voice instead of generic copy.",
        },
        {
          id: 'door-knocking',
          label: 'Door knocking',
          impact: "Higher daily knock targets unlocked. Follow-up tooling surfaced earlier.",
        },
        {
          id: 'fundraising',
          label: 'Fundraising',
          impact: "Donor outreach climbed the priority list. Advanced ask templates surfaced.",
        },
        {
          id: 'organizing',
          label: 'Organizing volunteers',
          impact: "Volunteer recruiting tasks unlocked earlier — bring your team in fast.",
        },
        {
          id: 'community',
          label: 'Local relationships',
          impact: "Suggested outreach targets will lean on your existing community ties first.",
        },
        {
          id: 'policy',
          label: 'Policy depth',
          impact: "Issue pages and stance templates surfaced — voters reward specificity.",
        },
        {
          id: 'social',
          label: 'Social media',
          impact: "Content templates and posting cadence guides moved to the top of your Academy.",
        },
      ],
    },
    {
      id: 'biggest-uncertainty',
      prompt: 'What are you most uncertain about right now?',
      role: 'political',
      options: [
        {
          id: 'message',
          label: 'My message',
          impact: 'We pinned a stump-speech walkthrough to the top of your Academy.',
          spawn: {
            id: 'read-stump-speech',
            title: 'Read: Crafting your stump speech',
            body: 'A two-minute speech you can give from memory at any door, coffee shop, or chamber meeting.',
            source: 'answer',
            role: 'comms',
            action: { label: 'Open lesson', href: '/dashboard/content' },
          },
        },
        {
          id: 'money',
          label: 'Money',
          impact: 'Fundraising track unlocked. First lesson queued below.',
          spawn: {
            id: 'read-first-ask',
            title: 'Read: Your first fundraising email',
            body: 'The template that has worked for first-time candidates raising under $25k.',
            source: 'answer',
            role: 'finance',
            action: { label: 'Open template', href: '/dashboard/content' },
          },
        },
        {
          id: 'voters',
          label: 'Finding voters',
          impact: "We'll preview Voter Records so you can see who is actually in your district.",
          spawn: {
            id: 'read-find-base',
            title: 'Read: Finding your base',
            body: 'How to identify the 200 voters most likely to back you, and how to reach them first.',
            source: 'answer',
            role: 'political',
            action: { label: 'Open lesson', href: '/dashboard/content' },
          },
        },
        {
          id: 'time',
          label: 'Time',
          impact: "We'll cap weekly task volume and add a time-blocking template.",
          spawn: {
            id: 'read-two-hour',
            title: 'Read: The two-hour campaign week',
            body: 'A schedule that wins for candidates with full-time jobs and families.',
            source: 'answer',
            role: 'manager',
            action: { label: 'Open lesson', href: '/dashboard/content' },
          },
        },
        {
          id: 'tech',
          label: 'The tools',
          impact: "We'll prioritize platform walkthroughs over strategy lessons for the next two weeks.",
          spawn: {
            id: 'read-tools-tour',
            title: 'Walkthrough: The tools that pay for themselves',
            body: 'A guided tour of the five features most candidates underuse.',
            source: 'answer',
            role: 'manager',
            action: { label: 'Start tour', href: '/dashboard' },
          },
        },
      ],
    },
  ],
  seedSuggestions: [
    {
      id: 'first-week-playbook',
      title: 'Read: First week playbook',
      body: "The four things every first-time candidate should do in week one, in the order that matters most.",
      source: 'preset',
      role: 'manager',
      action: { label: 'Open playbook', href: '/dashboard/content' },
    },
    {
      id: 'two-hour-candidate',
      title: 'Watch: The two-hour candidate',
      body: '15-minute video on running a real campaign without quitting your day job.',
      source: 'preset',
      role: 'manager',
      action: { label: 'Watch', href: '/dashboard/content' },
    },
    {
      id: 'attend-civic-event',
      title: 'Attend a civic event this week',
      body: 'Town halls, chamber meetings, school board sessions, neighborhood association meetings — show up at one this week. Bring cards, listen more than you talk, and leave with one name to follow up with.',
      source: 'preset',
      role: 'field',
      action: { label: 'How to work a civic event', href: '/dashboard/content' },
    },
    {
      id: 'val-daily-engagement',
      title: "You've logged in 5 of the last 7 days",
      body: "Consistent daily engagement is the single best predictor of a strong first month. You're already past the bar most first-timers struggle to clear.",
      source: 'validation',
      role: 'manager',
    },
    {
      id: 'val-supporter-list',
      title: 'You added 18 supporters to your contact list',
      body: "That's a solid starting universe. The next 50 will be the hardest to find — start with people who've already publicly endorsed someone in a nonpartisan race nearby.",
      source: 'validation',
      role: 'field',
    },
    {
      id: 'val-early-site-live',
      title: 'Your campaign website went live this week',
      body: "You're ahead of about 60% of first-time candidates who delay their site past week two. Voters who Google you will find a real page, not a placeholder.",
      source: 'validation',
      role: 'comms',
    },
  ],
}

const midCampaignReality: Preset = {
  id: 'mid-campaign-reality',
  label: 'Mid-campaign reality check',
  audience: 'Candidates 4+ weeks in. The plan they wrote on day one is now meeting the real world.',
  rationale:
    "You're past the launch sprint, which is the moment most plans drift quietly from reality. We picked three questions that catch the most common gaps: budget, volunteers, and your website. Each answer either updates campaign state directly or adds the next concrete task to your week.",
  questions: [
    {
      id: 'budget-accuracy',
      prompt: 'Is $3,500 still an accurate portrayal of your budget?',
      role: 'finance',
      options: [
        {
          id: 'yes',
          label: 'Yes',
          impact: 'Budget locked in. Spend tracking continues as-is.',
        },
        {
          id: 'off-a-little',
          label: 'Off by a little',
          impact: 'A budget review task was added to your weekly plan.',
          spawn: {
            id: 'budget-review',
            title: 'Spend 20 minutes on your budget this weekend',
            body: 'Small drift compounds. A quick re-baseline now prevents a fire drill at the end of the quarter.',
            source: 'answer',
            role: 'finance',
            action: { label: 'Open budget', href: '/dashboard' },
          },
        },
        {
          id: 'way-off',
          label: 'Way off',
          impact: "Got it. Update your budget right here — no need to open the builder.",
          followUp: {
            label: 'Update your campaign budget',
            placeholder: '5,000',
            prefix: '$',
            actionLabel: 'Save',
          },
        },
        {
          id: 'havent-looked',
          label: "Haven't looked",
          impact: 'A weekly budget reminder is now on your calendar.',
          spawn: {
            id: 'budget-reminder',
            title: 'Set aside 15 minutes for the budget this week',
            body: "If you haven't opened the budget recently, do it once and then schedule the next check.",
            source: 'answer',
            role: 'finance',
            action: { label: 'Open budget', href: '/dashboard' },
          },
        },
      ],
    },
    {
      id: 'volunteers-this-week',
      prompt: 'How many volunteers showed up this week?',
      role: 'field',
      options: [
        {
          id: 'zero',
          label: '0',
          impact: 'Volunteer recruiting was bumped to the top of next week.',
          spawn: {
            id: 'recruit-first-five',
            title: 'Read: Recruiting your first five volunteers',
            body: 'The three asks that work and the four that almost never do.',
            source: 'answer',
            role: 'field',
            action: { label: 'Open lesson', href: '/dashboard/content' },
          },
        },
        {
          id: 'one-two',
          label: '1–2',
          impact: "We'll add a shared schedule so you can keep them busy.",
          spawn: {
            id: 'volunteer-schedule',
            title: 'Set up a simple volunteer schedule',
            body: 'A one-page schedule outperforms a project management tool at this stage.',
            source: 'answer',
            role: 'field',
            action: { label: 'Open template', href: '/dashboard/content' },
          },
        },
        {
          id: 'three-five',
          label: '3–5',
          impact: 'Time to formalize roles. Volunteer roles guide added below.',
          spawn: {
            id: 'volunteer-roles',
            title: 'Read: Volunteer roles 101',
            body: "Field, comms, and ops — what to ask for and what to never delegate.",
            source: 'answer',
            role: 'field',
            action: { label: 'Open lesson', href: '/dashboard/content' },
          },
        },
        {
          id: 'six-plus',
          label: '6+',
          impact: "You have a team. Training becomes the next bottleneck.",
          spawn: {
            id: 'first-training',
            title: 'Plan a 30-minute volunteer training',
            body: 'One short training prevents most of the issues you would otherwise spend the week fixing.',
            source: 'answer',
            role: 'field',
            action: { label: 'Open agenda', href: '/dashboard/content' },
          },
        },
      ],
    },
    {
      id: 'website-accuracy',
      prompt: 'Is this your active website?',
      detail: 'https://janedoe-for-mayor.goodparty.org',
      role: 'comms',
      options: [
        {
          id: 'yes',
          label: 'Yes',
          impact: 'Site marked current.',
          followUpChoice: {
            label: 'Want a director to give it a review?',
            options: [
              {
                id: 'comms-review',
                label: 'Communications Director',
                impact: "Comms review queued. Expect copy and call-to-action notes within 24 hours.",
              },
              {
                id: 'political-review',
                label: 'Political Director',
                impact: 'Political review queued. Expect issue-framing feedback within 48 hours.',
              },
              {
                id: 'no-review',
                label: 'No thanks',
                impact: 'Got it. You can request a review anytime from your dashboard.',
              },
            ],
          },
        },
        {
          id: 'no',
          label: 'No',
          impact: "Got it. Add your campaign website here so voters can find you.",
          followUp: {
            label: 'Your campaign website URL',
            placeholder: 'https://janedoe-for-mayor.com',
            actionLabel: 'Save',
          },
        },
      ],
    },
  ],
  seedSuggestions: [
    {
      id: 'weekly-review',
      title: 'Schedule a 30-minute weekly review',
      body: 'The campaigns that finish strong are the ones that look at the numbers every week, even briefly.',
      source: 'preset',
      role: 'manager',
    },
    {
      id: 'regrounding',
      title: 'Read: Mid-campaign re-grounding',
      body: 'How to tell when you should stay the course versus when to change tactics.',
      source: 'preset',
      role: 'manager',
      action: { label: 'Open lesson', href: '/dashboard/content' },
    },
    {
      id: 'val-voter-contacts',
      title: '247 voter contacts in the last 14 days',
      body: "Above the median for races your size. Hold this pace through GOTV and you'll comfortably exceed your contact-universe target.",
      source: 'validation',
      role: 'field',
    },
    {
      id: 'val-mid-fundraising',
      title: '$3,500 raised so far',
      body: 'On pace for a $10k cycle total. The closing-month push is where the second half tends to come in — your trajectory looks healthy.',
      source: 'validation',
      role: 'finance',
    },
    {
      id: 'val-site-traffic',
      title: 'Website views are up 28% this week',
      body: 'Organic interest is building. A bump like this usually signals one specific thing worked — likely your last social post or a local mention.',
      source: 'validation',
      role: 'comms',
    },
  ],
}

const lastMonth: Preset = {
  id: 'last-month',
  label: 'Last month of campaign',
  audience: 'Candidates in the final four weeks before election day.',
  rationale:
    "You're in the final stretch and mistakes compound fast. We picked three questions tied to what actually moves the needle right now: election day coverage, your closing voter contact piece, and the final fundraising push.",
  questions: [
    {
      id: 'election-day-coverage',
      prompt: 'Do you have election day volunteer coverage locked in?',
      role: 'field',
      options: [
        {
          id: 'fully-staffed',
          label: 'Fully staffed',
          impact: 'Locked in. A run-of-show template was added to your dashboard.',
        },
        {
          id: 'most-slots',
          label: 'Most slots filled',
          impact: "Two short, specific asks beat one general one — we surfaced a template below.",
          spawn: {
            id: 'fill-last-slots',
            title: 'Fill your last few election day slots',
            body: 'Two short, specific asks beat one general one. Post both today to the Community thread.',
            source: 'answer',
            role: 'field',
            action: {
              label: 'Post in Community',
              href: 'https://goodpartyorg.circle.so/join?invitation_token=ee5c167c12e1335125a5c8dce7c493e95032deb7-a58159ab-64c4-422a-9396-b6925c225952',
            },
          },
        },
        {
          id: 'big-gaps',
          label: 'Big gaps',
          impact: 'Recruiting moved to the top of your tasks for the next 72 hours.',
          spawn: {
            id: 'urgent-ed-recruiting',
            title: 'Urgent: post an election day volunteer ask in Community',
            body: 'Candidates with 8+ election day volunteers consistently outperform those running with 3. Post the ask today.',
            source: 'answer',
            role: 'field',
            action: {
              label: 'Open Community',
              href: 'https://goodpartyorg.circle.so/join?invitation_token=ee5c167c12e1335125a5c8dce7c493e95032deb7-a58159ab-64c4-422a-9396-b6925c225952',
            },
          },
        },
        {
          id: 'not-started',
          label: "Haven't started",
          impact: 'Election day planning typically takes 2–3 weeks. Start today.',
          spawn: {
            id: 'start-ed-planning',
            title: 'Start election day planning today',
            body: 'Lock in three things this week: poll coverage, rides to the polls, and a phone bank for low-propensity supporters.',
            source: 'answer',
            role: 'field',
            action: {
              label: 'Open the ED checklist',
              href: '/dashboard/content',
            },
          },
        },
      ],
    },
    {
      id: 'closing-piece',
      prompt: 'Have you scheduled your closing voter contact piece?',
      role: 'comms',
      options: [
        {
          id: 'scheduled',
          label: 'Yes, scheduled',
          impact: 'Closing piece logged. Track delivery and reply rates as it goes out.',
        },
        {
          id: 'drafting',
          label: 'Drafting',
          impact: "Aim to send by Friday — pieces that land in the final weekend get read.",
          spawn: {
            id: 'send-by-friday',
            title: 'Send your closing piece by Friday',
            body: 'Pieces that arrive in the final weekend get read. Pieces that land Monday or Tuesday before election day often miss.',
            source: 'answer',
            role: 'comms',
            action: { label: 'Open draft', href: '/dashboard/outreach' },
          },
        },
        {
          id: 'not-yet',
          label: 'Not yet',
          impact: 'We pulled the closing-argument template to the top of your content list.',
          spawn: {
            id: 'use-closing-template',
            title: 'Use the closing-argument template',
            body: 'A 150-word template tested across 60+ down-ballot races. Plug in your three closing points and send.',
            source: 'answer',
            role: 'comms',
            action: { label: 'Open template', href: '/dashboard/content' },
          },
        },
      ],
    },
    {
      id: 'closing-ask',
      prompt: 'Have you made your closing fundraising ask?',
      role: 'finance',
      options: [
        {
          id: 'this-week',
          label: 'Done this week',
          impact: 'Logged. Watch for replies over the next 48 hours and follow up.',
        },
        {
          id: 'earlier',
          label: 'Earlier in the month',
          impact: "Time for a follow-up — non-responders convert at roughly 12% on a second ask.",
          spawn: {
            id: 'followup-nonresponders',
            title: 'Send a follow-up to non-responders',
            body: 'Same list, shorter message, one specific number. Pre-filled template attached.',
            source: 'answer',
            role: 'finance',
            action: { label: 'Open follow-up template', href: '/dashboard/content' },
          },
        },
        {
          id: 'drafting',
          label: 'Drafting',
          impact: "Closing-ask template is ready — don't over-polish.",
          spawn: {
            id: 'closing-ask-template',
            title: 'Use the closing-ask template',
            body: 'A 4-sentence ask with a specific dollar number outperforms a paragraph of context.',
            source: 'answer',
            role: 'finance',
            action: { label: 'Open template', href: '/dashboard/content' },
          },
        },
        {
          id: 'not-yet',
          label: 'Not yet',
          impact: 'Top finance task this week. Even a modest closing ask outperforms no ask.',
          spawn: {
            id: 'send-closing-ask',
            title: 'Send your closing ask today',
            body: 'Late campaigns underestimate how much can still come in. A simple ask with a specific target this week is worth the time.',
            source: 'answer',
            role: 'finance',
            action: { label: 'Open template', href: '/dashboard/content' },
          },
        },
      ],
    },
  ],
  seedSuggestions: [
    {
      id: 'final-stretch-checklist',
      title: 'Checklist: Final four weeks',
      body: 'The canonical last-month checklist — what to drop, what to double down on, and what to ignore.',
      source: 'preset',
      role: 'manager',
      action: { label: 'Open checklist', href: '/dashboard/content' },
    },
    {
      id: 'val-universe-coverage',
      title: '78% of your priority voter universe contacted',
      body: 'Strong final-stretch coverage. The remaining 22% are the highest-leverage knocks of the cycle — that is where the race tightens or breaks open.',
      source: 'validation',
      role: 'field',
    },
    {
      id: 'val-cycle-fundraising',
      title: '$7,200 raised this cycle',
      body: "Ahead of comparable races at the four-week mark. A closing ask should still pull another 8-12% if you send it before the final weekend.",
      source: 'validation',
      role: 'finance',
    },
    {
      id: 'val-civic-events',
      title: "You've shown up at 4 civic events this month",
      body: "Visibility plus a strong closing ground game is the combination that wins these last few weeks. You're putting yourself in the room.",
      source: 'validation',
      role: 'manager',
    },
  ],
}

export const presets: Preset[] = [firstTwoWeeks, midCampaignReality, lastMonth]

export const defaultPresetId = firstTwoWeeks.id

export const getPreset = (id: string): Preset =>
  presets.find((p) => p.id === id) ?? firstTwoWeeks

export const roleOrder: Role[] = [
  'manager',
  'field',
  'political',
  'comms',
  'finance',
]

export const roleLabels: Record<Role, string> = {
  field: 'Field',
  political: 'Political',
  comms: 'Communications',
  finance: 'Finance',
  manager: 'Campaign Manager',
}

export const roleSubtitles: Record<Role, string> = {
  field: 'Voter contact, volunteers, door-knocking',
  political: 'Strategy, targeting, coalition',
  comms: 'Website, messaging, announcements',
  finance: 'Budget, fundraising, spend',
  manager: 'Time, ops, the week ahead',
}
