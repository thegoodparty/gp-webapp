'use client'
import { useState } from 'react'
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Card, CardHeader, CardTitle, CardContent } from '@styleguide'
import { MeetingBriefingArtifact, BriefingSource } from '../types'
import { useArtifact } from '../hooks/useArtifact'
import { Stat } from './Stat'
import { ArtifactError } from './ArtifactError'

interface MeetingBriefingResultsProps {
  runId: string
}

const RecommendationBadge = ({
  recommendation,
}: {
  recommendation: string
}) => {
  const config: Record<string, { bg: string; label: string }> = {
    send: { bg: 'bg-green-100 text-green-800', label: 'Ready to Send' },
    review: { bg: 'bg-amber-100 text-amber-800', label: 'Needs Review' },
    hold: { bg: 'bg-red-100 text-red-800', label: 'Hold' },
  }
  const { bg, label } = config[recommendation] ?? {
    bg: 'bg-gray-100 text-gray-800',
    label: recommendation,
  }
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${bg}`}>
      {label}
    </span>
  )
}

const ScoreBar = ({ score, max = 10 }: { score: number; max?: number }) => {
  const pct = (score / max) * 100
  const color =
    score >= 7 ? 'bg-green-500' : score >= 4 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-gray-200">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums">
        {score}/{max}
      </span>
    </div>
  )
}

export const MeetingBriefingResults = ({
  runId,
}: MeetingBriefingResultsProps) => {
  const { artifact, loading, error, retry } =
    useArtifact<MeetingBriefingArtifact>(runId)
  const [expandedDimensions, setExpandedDimensions] = useState<Set<string>>(new Set())
  const [activeSection, setActiveSection] = useState<
    'teaser' | 'briefing' | 'score' | 'sources'
  >('briefing')

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

  const { eo, meeting, score, data_quality } = artifact

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>
                {eo.name} &middot; {eo.office}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {meeting.body} &middot; {meeting.date} at {meeting.time}
              </p>
            </div>
            <RecommendationBadge recommendation={score.recommendation} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Stat
              label="Score"
              value={`${score.total}/${score.max}`}
            />
            <Stat
              label="Agenda Items"
              value={String(artifact.agenda_items.length)}
            />
            <Stat label="Agenda" value={data_quality.agenda} />
            <Stat label="Fiscal" value={data_quality.fiscal} />
            <Stat label="Platform" value={data_quality.platform} />
          </div>
        </CardContent>
      </Card>

      <div className="border-b">
        <div className="flex gap-0">
          {(
            [
              { key: 'briefing', label: 'Full Briefing' },
              { key: 'teaser', label: 'Teaser Email' },
              { key: 'score', label: 'Score Breakdown' },
              { key: 'sources', label: `Sources (${artifact.sources?.length ?? 0})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeSection === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeSection === 'teaser' && (
        <Card>
          <CardHeader>
            <CardTitle>Teaser Email</CardTitle>
            <p className="text-xs text-muted-foreground">
              150-200 word preview email for delivery before the meeting
            </p>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-gray-50 p-6">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{artifact.teaser_email}</ReactMarkdown>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeSection === 'briefing' && (
        <Card>
          <CardHeader>
            <CardTitle>Governance Briefing</CardTitle>
            <p className="text-xs text-muted-foreground">
              Full briefing with constituency data, fiscal context, and prep
              recommendations
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{artifact.briefing_content}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {activeSection === 'sources' && (
        <Card>
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <p className="text-xs text-muted-foreground">
              Every data source accessed during briefing generation
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 pr-4 font-medium text-muted-foreground">ID</th>
                    <th className="pb-2 pr-4 font-medium text-muted-foreground">Type</th>
                    <th className="pb-2 pr-4 font-medium text-muted-foreground">Title</th>
                    <th className="pb-2 font-medium text-muted-foreground">Accessed</th>
                  </tr>
                </thead>
                <tbody>
                  {(artifact.sources ?? []).map((source: BriefingSource) => (
                    <tr key={source.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-mono text-xs">{source.id}</td>
                      <td className="py-2 pr-4">
                        <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${
                          source.type === 'government_record' ? 'bg-blue-100 text-blue-800' :
                          source.type === 'news' ? 'bg-purple-100 text-purple-800' :
                          source.type === 'staff_report' ? 'bg-green-100 text-green-800' :
                          source.type === 'campaign' ? 'bg-orange-100 text-orange-800' :
                          source.type === 'modeled' ? 'bg-gray-100 text-gray-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {source.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        {source.url && source.url !== 'n/a' ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {source.title}
                          </a>
                        ) : (
                          source.title
                        )}
                      </td>
                      <td className="py-2 text-xs text-muted-foreground whitespace-nowrap">
                        {source.accessed_at ? new Date(source.accessed_at).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeSection === 'score' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Quality Score</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  12 dimensions scored 0-10 each, max 120
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-semibold">
                  {score.total}/{score.max}
                </div>
                <RecommendationBadge recommendation={score.recommendation} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {score.dimensions.map((dim) => {
                const isExpanded = expandedDimensions.has(dim.id)
                return (
                  <div key={dim.id}>
                    <button
                      onClick={() => {
                        setExpandedDimensions((prev) => {
                          const next = new Set(prev)
                          if (next.has(dim.id)) next.delete(dim.id)
                          else next.add(dim.id)
                          return next
                        })
                      }}
                      className="flex w-full items-center justify-between py-1 text-left"
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="size-3 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="size-3 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">
                          {dim.name}
                        </span>
                      </div>
                      <ScoreBar score={dim.score} />
                    </button>
                    {isExpanded && (
                      <p className="ml-6 text-xs text-muted-foreground pb-2">
                        {dim.justification}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
