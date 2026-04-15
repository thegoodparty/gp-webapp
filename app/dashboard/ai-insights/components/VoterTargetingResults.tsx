'use client'
import { Download, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button } from '@styleguide'
import { VoterTargetingArtifact } from '../types'
import { useArtifact } from '../hooks/useArtifact'
import { Stat } from './Stat'
import { ArtifactError } from './ArtifactError'

interface VoterTargetingResultsProps {
  runId: string
}

const downloadCsv = (
  voters: VoterTargetingArtifact['segments'][0]['voters'],
  tierName: string,
) => {
  if (!voters || voters.length === 0) return

  const headers = [
    'voter_id',
    'first_name',
    'last_name',
    'address',
    'city',
    'zip',
    'age',
    'gender',
    'party',
    'voter_status',
  ]

  const escape = (val: string | number) => {
    const s = String(val)
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }

  const rows = voters.map((v) =>
    headers.map((h) => escape(v[h as keyof typeof v])).join(','),
  )
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${tierName.toLowerCase().replace(/\s+/g, '_')}_voters.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const TIER_COLORS: Record<number, string> = {
  1: 'border-green-200 bg-green-50',
  2: 'border-yellow-200 bg-yellow-50',
  3: 'border-orange-200 bg-orange-50',
  4: 'border-red-200 bg-red-50',
}

const TIER_BADGES: Record<number, string> = {
  1: 'bg-green-100 text-green-800',
  2: 'bg-yellow-100 text-yellow-800',
  3: 'bg-orange-100 text-orange-800',
  4: 'bg-red-100 text-red-800',
}

export const VoterTargetingResults = ({
  runId,
}: VoterTargetingResultsProps) => {
  const { artifact, loading, error, retry } =
    useArtifact<VoterTargetingArtifact>(runId)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !artifact) {
    return <ArtifactError error={error || 'Failed to load report.'} onRetry={retry} />
  }

  const { summary, segments, geographic_clusters, district, methodology } =
    artifact

  const tier1Count =
    segments.find((s) => s.tier === 1)?.count ?? 0
  const tier2Count =
    segments.find((s) => s.tier === 2)?.count ?? 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {district.name}, {district.state} — Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat
              label="Total Voters"
              value={summary.total_voters_in_district.toLocaleString()}
            />
            <Stat
              label="Base (Tier 1)"
              value={tier1Count.toLocaleString()}
            />
            <Stat
              label="Persuadable (Tier 2)"
              value={tier2Count.toLocaleString()}
            />
            <Stat
              label="Win Number"
              value={summary.win_number.toLocaleString()}
            />
          </div>
        </CardContent>
      </Card>

      {segments.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Voter Segments
          </h3>
          {segments.map((segment) => (
            <Card
              key={segment.tier}
              className={`border ${TIER_COLORS[segment.tier] || ''}`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${TIER_BADGES[segment.tier] || 'bg-gray-100'}`}
                    >
                      Tier {segment.tier}
                    </span>
                    <h4 className="font-semibold mt-1">{segment.name}</h4>
                  </div>
                  <span className="text-2xl font-bold">
                    {segment.count.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {segment.description}
                </p>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block mb-1">
                      Party
                    </span>
                    {Object.entries(segment.demographics.party_breakdown).map(
                      ([party, count]) => (
                        <div key={party} className="flex justify-between">
                          <span>{party}</span>
                          <span className="font-medium">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">
                      Age
                    </span>
                    {Object.entries(segment.demographics.age_distribution).map(
                      ([age, count]) => (
                        <div key={age} className="flex justify-between">
                          <span>{age}</span>
                          <span className="font-medium">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">
                      Gender
                    </span>
                    {Object.entries(segment.demographics.gender_split).map(
                      ([gender, count]) => (
                        <div key={gender} className="flex justify-between">
                          <span>{gender}</span>
                          <span className="font-medium">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>Priority: {segment.outreach_priority}</span>
                    <span>|</span>
                    <span>
                      Channels: {segment.recommended_channels.join(', ')}
                    </span>
                  </div>
                  {segment.voters && segment.voters.length > 0 && (
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() =>
                        downloadCsv(segment.voters, segment.name)
                      }
                    >
                      <Download className="size-3 mr-1" />
                      CSV ({segment.voters.length})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {geographic_clusters && geographic_clusters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Geographic Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {geographic_clusters.map((cluster, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <span className="font-medium text-sm">{cluster.area}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      Rank #{cluster.density_rank}
                    </span>
                  </div>
                  <span className="font-semibold">
                    {cluster.voter_count.toLocaleString()} voters
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {methodology && (
        <p className="text-xs text-muted-foreground italic">{methodology}</p>
      )}
    </div>
  )
}
