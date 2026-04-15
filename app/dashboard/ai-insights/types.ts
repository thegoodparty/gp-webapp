export type ExperimentStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'CONTRACT_VIOLATION' | 'STALE'

export type ExperimentId = 'voter_targeting' | 'walking_plan' | 'district_intel' | 'peer_city_benchmarking' | 'meeting_briefing'

export interface ExperimentRun {
  id: string
  runId: string
  experimentId: ExperimentId
  candidateId: string
  status: ExperimentStatus
  artifactKey?: string | null
  artifactBucket?: string | null
  durationSeconds?: number | null
  error?: string | null
  createdAt: string
  updatedAt: string
}

export interface VoterTargetingArtifact {
  candidate_id: string
  district: { state: string; type: string; name: string }
  generated_at: string
  summary: {
    total_voters_in_district: number
    win_number: number
    projected_turnout: number
  }
  segments: {
    tier: number
    name: string
    description: string
    count: number
    filters_used: string[]
    demographics: {
      party_breakdown: Record<string, number>
      age_distribution: Record<string, number>
      gender_split: Record<string, number>
    }
    outreach_priority: string
    recommended_channels: string[]
    voters?: {
      voter_id: string
      first_name: string
      last_name: string
      address: string
      city: string
      zip: string
      age: number
      gender: string
      party: string
      voter_status: string
    }[]
  }[]
  geographic_clusters: {
    area: string
    voter_count: number
    density_rank: number
  }[]
  methodology: string
}

export interface DistrictIntelArtifact {
  official_name: string
  office: string
  district: { state: string; type: string; name: string }
  generated_at: string
  summary: {
    total_constituents: number
    issues_identified: number
    meetings_analyzed: number
    sources_consulted: number
  }
  issues: {
    title: string
    summary: string
    status: string
    affected_constituents: number
    affected_segments?: {
      name: string
      count: number
      description: string
    }[]
    sources?: {
      id: number
      name: string
      url: string
      date: string
    }[]
  }[]
  demographic_snapshot: {
    total_voters: number
    party_breakdown: { party: string; count: number }[]
    age_distribution: { range: string; count: number }[]
  }
  methodology: string
}

export interface PeerCityBenchmarkingArtifact {
  official_name: string
  office: string
  district: { state: string; name: string }
  generated_at: string
  based_on_district_intel_run: string
  summary: {
    home_city_population: number
    peer_cities_analyzed: number
    issues_compared: number
    sources_consulted: number
  }
  home_city: {
    name: string
    state: string
    population: number
  }
  peer_cities: {
    name: string
    state: string
    population: number
    similarity_reason: string
  }[]
  comparisons: {
    issue: string
    home_city_approach: string
    peer_approaches: {
      city: string
      approach: string
      outcome: string
      budget: string
      timeline: string
      sources?: {
        id: number
        name: string
        url: string
        date: string
      }[]
    }[]
    takeaways: string
  }[]
  methodology: string
}

export interface BriefingSource {
  id: string
  type: string
  title: string
  url: string
  accessed_at: string
}

export interface MeetingBriefingArtifact {
  eo: {
    name: string
    city: string
    state: string
    office: string
  }
  meeting: {
    body: string
    date: string
    time: string
    agenda_source: string
  }
  agenda_items: {
    item_number: string
    title: string
    type: string
    requires_vote: boolean
  }[]
  fiscal: {
    tax_rate: string
    budget_total: string
    source: string
  }
  data_quality: {
    agenda: string
    fiscal: string
    platform: string
    overall: string
  }
  teaser_email: string
  briefing_content: string
  score: {
    total: number
    max: number
    recommendation: string
    dimensions: {
      id: string
      name: string
      score: number
      justification: string
    }[]
  }
  sources: BriefingSource[]
  generated_at: string
  based_on_district_intel_run: string
}
