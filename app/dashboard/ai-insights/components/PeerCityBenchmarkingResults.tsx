'use client'
import { useState } from 'react'
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@styleguide'
import { PeerCityBenchmarkingArtifact } from '../types'
import { useArtifact } from '../hooks/useArtifact'
import { Stat } from './Stat'
import { ArtifactError } from './ArtifactError'

interface PeerCityBenchmarkingResultsProps {
  runId: string
}

export const PeerCityBenchmarkingResults = ({
  runId,
}: PeerCityBenchmarkingResultsProps) => {
  const { artifact, loading, error, retry } =
    useArtifact<PeerCityBenchmarkingArtifact>(runId)
  const [expandedComparison, setExpandedComparison] = useState<number | null>(
    null,
  )

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

  const { summary, home_city, peer_cities, comparisons } = artifact

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
              label="Home Population"
              value={summary.home_city_population.toLocaleString()}
            />
            <Stat label="Peer Cities" value={summary.peer_cities_analyzed} />
            <Stat label="Issues Compared" value={summary.issues_compared} />
            <Stat label="Sources" value={summary.sources_consulted} />
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-base font-semibold mb-3">
          {home_city.name} vs. Peer Cities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-sm font-medium">{home_city.name}</p>
              <p className="text-xs text-muted-foreground">
                {home_city.state} &middot;{' '}
                {home_city.population.toLocaleString()} voters
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Home
              </span>
            </CardContent>
          </Card>
          {peer_cities.map((pc) => (
            <Card key={pc.name}>
              <CardContent className="pt-4 pb-3">
                <p className="text-sm font-medium">{pc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {pc.state} &middot; {pc.population.toLocaleString()} voters
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {pc.similarity_reason}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-3">Issue Comparisons</h3>
        <div className="space-y-3">
          {comparisons.map((comp, idx) => {
            const isExpanded = expandedComparison === idx
            return (
              <Card key={idx}>
                <button
                  className="w-full text-left"
                  onClick={() =>
                    setExpandedComparison(isExpanded ? null : idx)
                  }
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="size-4 shrink-0" />
                      ) : (
                        <ChevronRight className="size-4 shrink-0" />
                      )}
                      <CardTitle className="text-sm">{comp.issue}</CardTitle>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {comp.peer_approaches.length} peer{' '}
                        {comp.peer_approaches.length === 1
                          ? 'approach'
                          : 'approaches'}
                      </span>
                    </div>
                  </CardHeader>
                </button>

                {isExpanded && (
                  <CardContent className="pt-0 space-y-4">
                    <div className="rounded bg-muted/50 px-3 py-2">
                      <p className="text-xs font-medium mb-1">
                        {home_city.name}&apos;s Approach
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {comp.home_city_approach}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {comp.peer_approaches.map((pa, paIdx) => (
                        <div
                          key={paIdx}
                          className="rounded border px-3 py-2 space-y-1.5"
                        >
                          <p className="text-sm font-medium">{pa.city}</p>
                          <p className="text-sm text-muted-foreground">
                            {pa.approach}
                          </p>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="font-medium">Budget: </span>
                              <span className="text-muted-foreground">
                                {pa.budget}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Timeline: </span>
                              <span className="text-muted-foreground">
                                {pa.timeline}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Outcome: </span>
                              <span className="text-muted-foreground">
                                {pa.outcome}
                              </span>
                            </div>
                          </div>
                          {pa.sources?.length > 0 && (
                            <div className="space-y-0.5 pt-1">
                              {pa.sources.map((src) => (
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
                        </div>
                      ))}
                    </div>

                    <div className="rounded bg-green-50 px-3 py-2">
                      <p className="text-xs font-medium text-green-800 mb-1">
                        Key Takeaways
                      </p>
                      <p className="text-sm text-green-700">
                        {comp.takeaways}
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic">
        {artifact.methodology}
      </p>
    </div>
  )
}
