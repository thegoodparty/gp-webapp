// AUTO-GENERATED from ~/Downloads/voter_deadlines_2026_by_state.xlsx.
// Source workbook is the SOS-verified curated set of 2026 voter
// registration + absentee-request deadlines per state, addressing the
// BallotReady data quality issues (e.g. CA registration showing Nov 2
// instead of the actual Oct 19, CA absentee 'request deadline' even
// though CA is universal vote-by-mail).
//
// Update for the next election cycle by regenerating this file from
// the next year's workbook. Do NOT hand-edit dates here.

export type Confidence = 'High' | 'Medium' | 'Low'

export interface RegistrationDeadline {
  date: string | null // ISO YYYY-MM-DD; null when no fixed cutoff (e.g. SDR through ED)
  tierNote: string | null // human note when methods differ; null when uniform
  confidence: Confidence
}

export interface AbsenteeDeadline extends RegistrationDeadline {
  isUniversalVbm: boolean // when true the milestone is omitted entirely
}

export interface StateVoterDeadlines2026 {
  registration: RegistrationDeadline
  absentee: AbsenteeDeadline
}

export const VOTER_DEADLINES_2026: Record<string, StateVoterDeadlines2026> = {
  AK: {
    registration: {
      date: '2026-10-04',
      tierNote: null,
      confidence: 'Medium' as Confidence,
    },
    absentee: {
      date: '2026-10-24',
      tierNote: 'Online Oct 19; Mail Oct 24',
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  AL: {
    registration: {
      date: '2026-10-19',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-27',
      tierNote: 'Mail Oct 27; In-person Oct 29',
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  AR: {
    registration: {
      date: '2026-10-05',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-27',
      tierNote: 'Mail Oct 27; In-person Oct 30',
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  AZ: {
    registration: {
      date: '2026-10-05',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-23',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  CA: {
    registration: {
      date: '2026-10-19',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: null,
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: true,
    },
  },
  CO: {
    registration: {
      date: '2026-10-26',
      tierNote: 'Online Oct 26; Mail Oct 26; In-person Election Day',
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: null,
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: true,
    },
  },
  CT: {
    registration: {
      date: '2026-10-16',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-11-02',
      tierNote: null,
      confidence: 'Medium' as Confidence,
      isUniversalVbm: false,
    },
  },
  DC: {
    registration: {
      date: '2026-10-13',
      tierNote: 'Online Oct 13; Mail Oct 13; In-person Election Day',
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: null,
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: true,
    },
  },
  DE: {
    registration: {
      date: '2026-10-10',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-30',
      tierNote: null,
      confidence: 'Medium' as Confidence,
      isUniversalVbm: false,
    },
  },
  FL: {
    registration: {
      date: '2026-10-05',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-22',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  GA: {
    registration: {
      date: '2026-10-05',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-23',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  HI: {
    registration: {
      date: '2026-10-24',
      tierNote: 'Online Election Day; Mail Oct 24; In-person Election Day',
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: null,
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: true,
    },
  },
  IA: {
    registration: {
      date: '2026-10-19',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-19',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  ID: {
    registration: {
      date: '2026-10-23',
      tierNote: 'Online Oct 23; Mail Oct 9; In-person Oct 9',
      confidence: 'Medium' as Confidence,
    },
    absentee: {
      date: '2026-10-23',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  IL: {
    registration: {
      date: '2026-10-18',
      tierNote: 'Online Oct 18; Mail Oct 6; In-person Oct 6',
      confidence: 'Medium' as Confidence,
    },
    absentee: {
      date: '2026-10-29',
      tierNote: 'Online Oct 29; Mail Oct 29; In-person Nov 2',
      confidence: 'Medium' as Confidence,
      isUniversalVbm: false,
    },
  },
  IN: {
    registration: {
      date: '2026-10-05',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-22',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  KS: {
    registration: {
      date: '2026-10-13',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-27',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  KY: {
    registration: {
      date: '2026-10-05',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-20',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  LA: {
    registration: {
      date: '2026-10-14',
      tierNote: 'Online Oct 14; Mail Oct 5; In-person Oct 5',
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-30',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  MA: {
    registration: {
      date: '2026-10-24',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-27',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  MD: {
    registration: {
      date: '2026-10-13',
      tierNote: 'Online Oct 13; Mail Oct 13; In-person Election Day',
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-27',
      tierNote: 'Online Oct 30; Mail Oct 27; In-person Election Day',
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  ME: {
    registration: {
      date: '2026-10-13',
      tierNote: 'Online Oct 13; Mail Oct 13; In-person Election Day',
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-29',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  MI: {
    registration: {
      date: '2026-10-19',
      tierNote: 'Online Oct 19; Mail Oct 19; In-person Election Day',
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-30',
      tierNote: 'Online Oct 30; Mail Oct 30; In-person Nov 2',
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  MN: {
    registration: {
      date: '2026-10-13',
      tierNote: 'Online Oct 13; Mail Oct 13; In-person Election Day',
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-11-02',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  MO: {
    registration: {
      date: '2026-10-07',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-21',
      tierNote: 'Mail Oct 21; In-person Nov 2',
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  MS: {
    registration: {
      date: '2026-10-05',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-31',
      tierNote: null,
      confidence: 'Medium' as Confidence,
      isUniversalVbm: false,
    },
  },
  MT: {
    registration: {
      date: '2026-10-05',
      tierNote: 'Mail Oct 5; In-person Election Day',
      confidence: 'Medium' as Confidence,
    },
    absentee: {
      date: '2026-11-02',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  NC: {
    registration: {
      date: '2026-10-09',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-20',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  ND: {
    registration: {
      date: null,
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-11-02',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  NE: {
    registration: {
      date: '2026-10-16',
      tierNote: 'Online Oct 16; Mail Oct 16; In-person Oct 23',
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-23',
      tierNote: 'Mail Oct 23; In-person Oct 30',
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  NH: {
    registration: {
      date: null,
      tierNote:
        'Mail Set locally; In-person Supervisors of Checklist session 6-13 days before',
      confidence: 'Low' as Confidence,
    },
    absentee: {
      date: '2026-11-02',
      tierNote: null,
      confidence: 'Medium' as Confidence,
      isUniversalVbm: false,
    },
  },
  NJ: {
    registration: {
      date: '2026-10-13',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-27',
      tierNote: 'Online Oct 27; Mail Oct 27; In-person Nov 2',
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  NM: {
    registration: {
      date: '2026-10-06',
      tierNote: null,
      confidence: 'Medium' as Confidence,
    },
    absentee: {
      date: '2026-10-20',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  NV: {
    registration: {
      date: '2026-10-29',
      tierNote: 'Online Oct 29; Mail Oct 6; In-person Oct 6',
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: null,
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: true,
    },
  },
  NY: {
    registration: {
      date: '2026-10-24',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-24',
      tierNote: 'Online Oct 24; Mail Oct 24; In-person Nov 2',
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  OH: {
    registration: {
      date: '2026-10-05',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-27',
      tierNote: 'Mail Oct 27; In-person Nov 2',
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  OK: {
    registration: {
      date: '2026-10-09',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-19',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  OR: {
    registration: {
      date: '2026-10-13',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: null,
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: true,
    },
  },
  PA: {
    registration: {
      date: '2026-10-19',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-27',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  RI: {
    registration: {
      date: '2026-10-04',
      tierNote: null,
      confidence: 'Medium' as Confidence,
    },
    absentee: {
      date: '2026-10-13',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  SC: {
    registration: {
      date: '2026-10-05',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-23',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  SD: {
    registration: {
      date: '2026-10-19',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-11-02',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  TN: {
    registration: {
      date: '2026-10-05',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-24',
      tierNote: null,
      confidence: 'Medium' as Confidence,
      isUniversalVbm: false,
    },
  },
  TX: {
    registration: {
      date: '2026-10-05',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-23',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  UT: {
    registration: {
      date: '2026-10-23',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: null,
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: true,
    },
  },
  VA: {
    registration: {
      date: '2026-10-23',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-23',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  VT: {
    registration: {
      date: null,
      tierNote:
        'Online Election Day; Mail Election Day; In-person Election Day',
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: null,
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: true,
    },
  },
  WA: {
    registration: {
      date: '2026-10-26',
      tierNote: 'Online Oct 26; Mail Oct 26; In-person Election Day',
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: null,
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: true,
    },
  },
  WI: {
    registration: {
      date: '2026-10-14',
      tierNote: 'Online Oct 14; Mail Oct 14; In-person Oct 30',
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-29',
      tierNote: 'Online Oct 29; Mail Oct 29; In-person Through Sun before',
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  WV: {
    registration: {
      date: '2026-10-13',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-10-28',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
  WY: {
    registration: {
      date: '2026-10-20',
      tierNote: null,
      confidence: 'High' as Confidence,
    },
    absentee: {
      date: '2026-11-02',
      tierNote: null,
      confidence: 'High' as Confidence,
      isUniversalVbm: false,
    },
  },
}
