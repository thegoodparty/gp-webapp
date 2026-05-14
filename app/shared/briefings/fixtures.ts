/**
 * Hand-authored briefing fixtures used during development before Swain's API
 * and Melecia's generator are ready.
 *
 * Two briefings:
 *  1. city-council-june-1-2026 — Briefing ready, full content.
 *  2. planning-board-june-15-2026 — Awaiting agenda, list-only metadata.
 *
 * Replace consumers with real API calls once endpoints are live.
 */

import type { Briefing, BriefingSummary } from './types'

export const briefingReadyFixture: Briefing = {
  id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R',
  slug: 'city-council-june-1-2026',
  meetingId: 'mtg_01HQX5',
  title: 'City Council meeting briefing for June 1, 2026',
  meetingDate: 'June 1, 2026',
  status: 'briefing_ready',
  readingTimeMinutes: 8,
  generatedAt: '2026-05-13T14:22:08Z',
  meeting: {
    id: 'mtg_01HQX5',
    name: 'City Council',
    body: 'City Council',
    type: 'city_council',
    scheduledAt: '2026-06-01T18:00:00-05:00',
    location: 'City Hall Council Chambers',
  },
  executiveSummary:
    'The following items on your agenda require action and/or have a vote:',
  agenda: [
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-01',
      title: 'Call to order',
      kind: 'procedural',
      hasBriefing: false,
      whatToExpect:
        'The mayor gavels the meeting open and the clerk records the start time. No action expected.',
    },
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-02',
      title: 'Roll call',
      kind: 'procedural',
      hasBriefing: false,
      whatToExpect:
        'The clerk reads the roster. Be ready to respond when your name is called.',
    },
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-03',
      title: 'Approval of minutes, April 6',
      kind: 'procedural',
      hasBriefing: false,
      whatToExpect:
        'A vote to approve the minutes of the prior meeting. Routine; flag corrections in advance if needed.',
    },
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-04',
      title: 'Public comment period',
      kind: 'public_input',
      hasBriefing: false,
      whatToExpect:
        'Residents address council on agenda or non-agenda matters. Listen for themes that may shape later votes.',
    },
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-05',
      title: 'Consent agenda, 9 items',
      kind: 'consent',
      hasBriefing: false,
      whatToExpect:
        'Nine routine items bundled for a single vote. Pull any item to the regular agenda if it deserves debate.',
    },
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-06',
      title: 'Public Safety Camera Expansion',
      kind: 'action',
      hasBriefing: true,
    },
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-07',
      title: 'Update from the City Manager',
      kind: 'informational',
      hasBriefing: false,
    },
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-08',
      title: 'FY2027 Property Tax Rate Direction',
      kind: 'action',
      hasBriefing: true,
    },
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-09',
      title: 'Stormwater fee schedule update',
      kind: 'action',
      hasBriefing: false,
    },
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-10',
      title: 'Library hours pilot results',
      kind: 'informational',
      hasBriefing: false,
    },
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-11',
      title: 'Ramsey Street Corridor Revitalization',
      kind: 'action',
      hasBriefing: false,
    },
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-12',
      title: 'Appointments to Planning Board, 2 vacancies',
      kind: 'action',
      hasBriefing: false,
    },
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-13',
      title: 'Reports from boards and commissions',
      kind: 'informational',
      hasBriefing: false,
    },
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-14',
      title: 'Adjournment',
      kind: 'procedural',
      hasBriefing: false,
    },
  ],
  actionItems: [
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-06',
      title: 'Public Safety Camera Expansion',
      overview:
        "You're voting on the vendor contract and camera locations across the city. The vendor decision is mostly staff's call. The location map is where your voice matters. Look at the map before Monday. If the northside and Ramsey Street corridor aren't on it, say so before the vote. Your silence will be read as agreement.",
      constituentSentiment: {
        summary: '72% support, 18% oppose',
        detail:
          'Northside support climbs to 81%. Camera-request volume from the Ramsey corridor is 3.4x the citywide average over the last 12 months.',
        sources: ['src-psce-1'],
      },
      recentNews: [
        {
          title:
            'Council weighs camera expansion as Northside residents press for action',
          outlet: 'Burnsville Sentinel',
          url: 'https://www.burnsvillesentinel.com/cameras',
        },
        {
          title:
            'Privacy advocates urge audit clause in upcoming camera contract',
          outlet: 'City Pulse',
          url: 'https://www.citypulse.news/cameras-audit',
        },
        {
          title: 'Downtown business owners back targeted camera placement',
          outlet: 'Riverside Tribune',
          url: 'https://www.riversidetribune.com/cameras',
        },
      ],
      budgetImpact: {
        summary:
          "$1.2M one-time install plus $180K per year ops. Spread across the levy, that's about $8.40 per household one-time and $1.30 per household per year ongoing.",
        sources: ['src-psce-2'],
      },
      talkingPoints: [
        '72% citywide support and 81% on the Northside. The location map should reflect where the demand actually is.',
        'Councilmember Brennan voted yes on the 2024 downtown camera package on a 65% support read; this proposal has higher support and 3.4x the request volume in the underserved blocks.',
        'Ask Councilmember Pak to attach the same quarterly privacy and access audit clause she pushed for on the 2024 body-cam contract.',
      ],
      sources: [
        {
          id: 'src-psce-1',
          label: 'Good Party internal data',
          kind: 'internal',
          iconInitial: 'G',
          url: null,
        },
        {
          id: 'src-psce-2',
          label: 'burnsvillemn.gov',
          kind: 'official',
          iconInitial: 'B',
          url: 'https://burnsvillemn.gov',
        },
      ],
    },
    {
      id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9R-08',
      title: 'FY2027 Property Tax Rate Direction',
      overview:
        "There's no vote Monday, but this crucial conversation sets the table before numbers are locked in. What you say now shapes what the City Manager puts in front of you in May. Your community wants lower taxes and better services. Don't commit to a plan yet. Walk in with a clear point of view. Focus on values for now, that's what keeps your options open and your credibility intact.",
      constituentSentiment: null,
      recentNews: [
        {
          title: 'Property tax debate heats up ahead of FY27 first reading',
          outlet: 'City Pulse',
          url: 'https://www.citypulse.news/property-tax-fy27',
        },
        {
          title: 'Seniors urge council to hold residential rate flat',
          outlet: 'Burnsville Sentinel',
          url: 'https://www.burnsvillesentinel.com/seniors-tax-flat',
        },
        {
          title: 'Staff weigh which capital projects depend on a rate bump',
          outlet: 'Riverside Tribune',
          url: 'https://www.riversidetribune.com/capital-projects-rate',
        },
      ],
      budgetImpact: {
        summary:
          'Direction-only discussion. No fiscal commitment Monday, but the tone set here drives the May first reading.',
        sources: ['src-tax-1'],
      },
      talkingPoints: [
        'Affirm the priority on residential stability without ruling out a small commercial-side adjustment.',
        'Ask the City Manager to bring two scenarios to first reading, not one, so the choice stays on the council.',
      ],
      sources: [
        {
          id: 'src-tax-1',
          label: 'burnsvillemn.gov',
          kind: 'official',
          iconInitial: 'B',
          url: 'https://burnsvillemn.gov',
        },
      ],
    },
  ],
}

export const awaitingAgendaFixture: BriefingSummary = {
  id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9S',
  slug: 'planning-board-june-15-2026',
  meetingDate: 'June 15, 2026',
  meetingName: 'Planning Board',
  meetingType: 'planning_board',
  scheduledAt: '2026-06-15T19:00:00-05:00',
  location: 'City Hall Council Chambers',
  status: 'awaiting_agenda',
}

const cityCouncilJulyFixture: BriefingSummary = {
  id: 'br_01HQX7K9P1AE3Z3GZB1T5V8M9T',
  slug: 'city-council-july-6-2026',
  meetingDate: 'July 6, 2026',
  meetingName: 'City Council',
  meetingType: 'city_council',
  scheduledAt: '2026-07-06T18:00:00-05:00',
  location: 'City Hall Council Chambers',
  status: 'briefing_ready',
}

export const briefingsLandingFixture: BriefingSummary[] = [
  {
    id: briefingReadyFixture.id,
    slug: briefingReadyFixture.slug,
    meetingDate: briefingReadyFixture.meetingDate,
    meetingName: briefingReadyFixture.meeting.name,
    meetingType: briefingReadyFixture.meeting.type,
    scheduledAt: briefingReadyFixture.meeting.scheduledAt,
    location: briefingReadyFixture.meeting.location,
    status: briefingReadyFixture.status,
  },
  awaitingAgendaFixture,
  cityCouncilJulyFixture,
]

export const briefingsBySlug: Record<string, Briefing> = {
  [briefingReadyFixture.slug]: briefingReadyFixture,
}
