'use client'
import { useState } from 'react'
import {
  Download,
  ExternalLink,
  Loader2,
  MapPin,
  Clock,
  ChevronDown,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button } from '@styleguide'
import { useArtifact } from '../hooks/useArtifact'
import { Stat } from './Stat'
import { ArtifactError } from './ArtifactError'

interface WalkingPlanVoter {
  order: number
  address: string
  voter_name: string
  party: string
  voter_status: string
  age: number
  talking_points: string[]
}

interface WalkingPlanArea {
  name?: string
  zip: string
  city: string
  priority_rank: number
  door_count: number
  estimated_minutes: number
  party_breakdown: Record<string, number>
  maps_url?: string
  voters: WalkingPlanVoter[]
}

interface WalkingPlanArtifact {
  candidate_id: string
  candidate_name: string
  district: { state: string; type: string; name: string }
  generated_at: string
  summary: {
    total_areas: number
    total_doors: number
    estimated_total_hours: number
    top_issues: string[]
  }
  areas: WalkingPlanArea[]
  routes?: { route_id: number; area_name: string; stops: WalkingPlanVoter[] }[]
  methodology: string
}

interface WalkingPlanResultsProps {
  runId: string
}

const downloadVotersCsv = (voters: WalkingPlanVoter[], label: string) => {
  if (!voters.length) return

  const headers = [
    'order',
    'voter_name',
    'address',
    'party',
    'voter_status',
    'age',
    'talking_points',
  ]

  const escape = (val: string | number) => {
    const s = String(val)
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }

  const rows = voters.map((v) =>
    [
      escape(v.order),
      escape(v.voter_name),
      escape(v.address),
      escape(v.party),
      escape(v.voter_status),
      escape(v.age),
      escape((v.talking_points || []).join(' | ')),
    ].join(','),
  )

  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `walking_plan_${label.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const normalizeArtifact = (
  artifact: WalkingPlanArtifact,
): WalkingPlanArea[] => {
  if (artifact.areas?.length) return artifact.areas

  if (!artifact.routes?.length) return []
  const groupMap = new Map<string, WalkingPlanArea>()

  for (const route of artifact.routes) {
    const zip = route.stops?.[0]?.address?.match(/\d{5}/)?.[0] ||
      route.area_name?.match(/\d{5}/)?.[0] || 'Unknown'
    const city = route.area_name?.replace(/,?\s*\d{5}.*/, '').trim() || 'Unknown'

    if (!groupMap.has(zip)) {
      groupMap.set(zip, {
        zip,
        city,
        priority_rank: route.route_id,
        door_count: 0,
        estimated_minutes: 0,
        party_breakdown: {},
        voters: [],
      })
    }

    const group = groupMap.get(zip)!
    group.door_count += route.stops?.length || 0
    group.estimated_minutes += (route.stops?.length || 0) * 4
    if (route.stops) {
      group.voters.push(...route.stops.map((s, i) => ({
        ...s,
        order: group.voters.length + i + 1,
      })))
    }
  }

  return Array.from(groupMap.values())
    .sort((a, b) => b.door_count - a.door_count)
    .map((area, i) => ({ ...area, priority_rank: i + 1 }))
}

export const WalkingPlanResults = ({ runId }: WalkingPlanResultsProps) => {
  const { artifact, loading, error, retry } =
    useArtifact<WalkingPlanArtifact>(runId)
  const [expandedArea, setExpandedArea] = useState<string | null>(null)

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

  const areas = normalizeArtifact(artifact)
  const { summary, district, methodology } = artifact
  const totalDoors = summary?.total_doors || areas.reduce((s, a) => s + a.door_count, 0)
  const totalHours = summary?.estimated_total_hours || areas.reduce((s, a) => s + a.estimated_minutes, 0) / 60

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {[district.name, district.state].filter(Boolean).join(', ') || 'Walking Plan'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Stat label="Areas" value={String(areas.length)} />
            <Stat label="Total Doors" value={totalDoors.toLocaleString()} />
            <Stat label="Est. Hours" value={totalHours.toFixed(1)} />
          </div>
          {summary?.top_issues && summary.top_issues.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {summary.top_issues.map((issue) => (
                <span
                  key={issue}
                  className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium"
                >
                  {issue}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Walking Routes
          </h3>
          <Button
            variant="outline"
            size="small"
            onClick={() =>
              downloadVotersCsv(
                areas.flatMap((a) => a.voters),
                'all_areas',
              )
            }
          >
            <Download className="size-3 mr-1" />
            Download All ({totalDoors})
          </Button>
        </div>

        {areas.map((area, idx) => {
          const areaKey = area.name || area.zip || String(idx)
          const isExpanded = expandedArea === areaKey
          const hours = (area.estimated_minutes / 60).toFixed(1)
          const displayName = area.name || area.zip

          return (
            <Card key={areaKey}>
              <button
                onClick={() =>
                  setExpandedArea(isExpanded ? null : areaKey)
                }
                className="w-full text-left"
              >
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary text-xs font-bold shrink-0">
                        {area.priority_rank}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">
                          {displayName}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {area.door_count.toLocaleString()} doors
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {hours}h
                          </span>
                          {area.maps_url && (
                            <a
                              href={area.maps_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              <ExternalLink className="size-3" />
                              Walking Route
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`size-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </CardContent>
              </button>

              {isExpanded && (
                <CardContent className="pt-0 pb-4">
                  <div className="border-t pt-3 space-y-3">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadVotersCsv(
                            area.voters,
                            `${area.city}_${area.zip}`,
                          )
                        }}
                      >
                        <Download className="size-3 mr-1" />
                        CSV ({area.voters.length} voters)
                      </Button>
                    </div>

                    {area.voters.slice(0, 20).map((voter) => (
                      <div
                        key={voter.order}
                        className="flex gap-2 text-xs rounded bg-gray-50 p-2"
                      >
                        <span className="font-bold text-muted-foreground shrink-0 w-5 text-right">
                          {voter.order}.
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="font-medium">
                            {voter.voter_name}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            {voter.address}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            · {voter.party}
                            {voter.age > 0 && ` · ${voter.age}y`}
                          </span>
                          {voter.talking_points?.[0] && (
                            <p className="text-muted-foreground italic mt-0.5 truncate">
                              {voter.talking_points[0]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {area.voters.length > 20 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{area.voters.length - 20} more voters (download CSV
                        for full list)
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {methodology && (
        <p className="text-xs text-muted-foreground italic">{methodology}</p>
      )}
    </div>
  )
}
