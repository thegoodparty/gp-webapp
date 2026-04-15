'use client'
import { useState } from 'react'
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@styleguide'
import { DistrictIntelArtifact } from '../types'
import { useArtifact } from '../hooks/useArtifact'
import { Stat } from './Stat'
import { ArtifactError } from './ArtifactError'

interface DistrictIntelResultsProps {
  runId: string
}

const STATUS_BADGES: Record<string, string> = {
  active: 'bg-blue-100 text-blue-800',
  upcoming: 'bg-purple-100 text-purple-800',
  recently_decided: 'bg-gray-100 text-gray-800',
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  upcoming: 'Upcoming',
  recently_decided: 'Decided',
}

const CitedText = ({
  text,
  sources,
}: {
  text: string
  sources: DistrictIntelArtifact['issues'][0]['sources']
}) => {
  const sourceMap = new Map(sources.map((s) => [s.id, s]))
  const parts = text.split(/(\[\d+\])/)

  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[(\d+)\]$/)
        if (!match) return <span key={i}>{part}</span>

        const id = Number(match[1])
        const source = sourceMap.get(id)
        if (!source) return <sup key={i}>[{id}]</sup>

        return (
          <a
            key={i}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${source.name} (${source.date})`}
            className="text-primary hover:underline"
          >
            <sup className="font-medium">{id}</sup>
          </a>
        )
      })}
    </>
  )
}

export const DistrictIntelResults = ({
  runId,
}: DistrictIntelResultsProps) => {
  const { artifact, loading, error, retry } =
    useArtifact<DistrictIntelArtifact>(runId)
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null)

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

  const { summary, issues, demographic_snapshot } = artifact

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {artifact.official_name} &mdash; {artifact.office}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {artifact.district.name}, {artifact.district.state}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat
              label="Constituents"
              value={summary.total_constituents.toLocaleString()}
            />
            <Stat label="Issues Found" value={summary.issues_identified} />
            <Stat label="Meetings Analyzed" value={summary.meetings_analyzed} />
            <Stat label="Sources" value={summary.sources_consulted} />
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-base font-semibold mb-3">Issues</h3>
        <div className="space-y-3">
          {issues.map((issue, idx) => {
            const isExpanded = expandedIssue === idx
            return (
              <Card key={idx}>
                <button
                  className="w-full text-left"
                  onClick={() => setExpandedIssue(isExpanded ? null : idx)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="size-4 shrink-0" />
                        ) : (
                          <ChevronRight className="size-4 shrink-0" />
                        )}
                        <CardTitle className="text-sm">{issue.title}</CardTitle>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_BADGES[issue.status] ??
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {STATUS_LABELS[issue.status] ?? issue.status}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {issue.affected_constituents.toLocaleString()} affected
                      </span>
                    </div>
                  </CardHeader>
                </button>

                {isExpanded && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      <CitedText
                        text={issue.summary}
                        sources={issue.sources ?? []}
                      />
                    </p>

                    {issue.sources?.length > 0 && (
                      <div className="mb-3 space-y-1">
                        {issue.sources.map((src) => (
                          <div
                            key={src.id}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                          >
                            <span className="font-medium text-primary">
                              [{src.id}]
                            </span>
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline truncate"
                            >
                              {src.name}
                            </a>
                            <span className="shrink-0">{src.date}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {issue.affected_segments?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-2">
                          Affected Segments
                        </p>
                        <div className="space-y-1.5">
                          {issue.affected_segments.map((seg, segIdx) => (
                            <div
                              key={segIdx}
                              className="flex items-center justify-between rounded bg-muted/50 px-3 py-1.5 text-xs"
                            >
                              <div>
                                <span className="font-medium">{seg.name}</span>
                                <span className="text-muted-foreground ml-2">
                                  {seg.description}
                                </span>
                              </div>
                              <span className="font-medium shrink-0">
                                {seg.count.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Demographic Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium mb-2">Party Breakdown</p>
              <div className="space-y-1.5">
                {demographic_snapshot.party_breakdown.map((pb) => {
                  const pct =
                    demographic_snapshot.total_voters > 0
                      ? (pb.count / demographic_snapshot.total_voters) * 100
                      : 0
                  return (
                    <div key={pb.party} className="text-xs">
                      <div className="flex justify-between mb-0.5">
                        <span>{pb.party}</span>
                        <span className="text-muted-foreground">
                          {pb.count.toLocaleString()} ({pct.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium mb-2">Age Distribution</p>
              <div className="space-y-1.5">
                {demographic_snapshot.age_distribution.map((ad) => {
                  const pct =
                    demographic_snapshot.total_voters > 0
                      ? (ad.count / demographic_snapshot.total_voters) * 100
                      : 0
                  return (
                    <div key={ad.range} className="text-xs">
                      <div className="flex justify-between mb-0.5">
                        <span>{ad.range}</span>
                        <span className="text-muted-foreground">
                          {ad.count.toLocaleString()} ({pct.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground italic">
        {artifact.methodology}
      </p>
    </div>
  )
}
