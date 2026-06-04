'use client'
import { useEffect, useMemo } from 'react'
import { useQuery, queryOptions } from '@tanstack/react-query'
import { UsersRound } from 'lucide-react'
import { clientRequest } from 'gpApi/typed-request'
import { reportErrorToSentry } from '@shared/sentry'
import { NumberInsight } from 'app/polls/onboarding/components/NumberInsight'
import { DataVisualizationInsight } from 'app/polls/onboarding/components/DataVisualizationInsight'
import { mapContactsStatsToCharts } from 'app/polls/onboarding/utils/mapContactsStatsToCharts'
import { LocalNewsSourcesSection } from './LocalNewsSourcesSection'
import { TopVoterIssuesSection } from './TopVoterIssuesSection'

const onboardingDistrictStatsQueryOptions = (params: {
  ballotReadyPositionId?: string
  districtId?: string
}) =>
  queryOptions({
    queryKey: ['onboarding-contacts-stats', params] as const,
    enabled: Boolean(params.ballotReadyPositionId || params.districtId),
    queryFn: () =>
      clientRequest('GET /v1/onboarding/contacts/stats', params).then(
        (res) => res.data,
      ),
  })

export { onboardingDistrictStatsQueryOptions }

interface VoterDemographicsStepProps {
  ballotReadyPositionId?: string
  districtId?: string
  city?: string
  state?: string
  office?: string
  showLocalNewsSources?: boolean
  headingsAsSubsections?: boolean
}

export const VoterDemographicsStep = ({
  ballotReadyPositionId,
  districtId,
  city,
  state,
  office,
  showLocalNewsSources = true,
  headingsAsSubsections = false,
}: VoterDemographicsStepProps): React.JSX.Element => {
  const query = useQuery(
    onboardingDistrictStatsQueryOptions({ ballotReadyPositionId, districtId }),
  )

  useEffect(() => {
    if (!query.error) return
    reportErrorToSentry(query.error, {
      context: 'onboarding.voterDemographics.fetchStats',
      ballotReadyPositionId,
      districtId,
    })
  }, [query.error, ballotReadyPositionId, districtId])

  const isLoading =
    query.isPending && Boolean(ballotReadyPositionId || districtId)
  const error = query.error?.message

  const chartData = useMemo(
    () => mapContactsStatsToCharts(query.data),
    [query.data],
  )

  let locationLabel = ''
  if (office) {
    locationLabel = office
  } else if (city && state) {
    locationLabel = `${city}, ${state}`
  } else if (state) {
    locationLabel = state
  }

  const HeadingTag = headingsAsSubsections ? 'h3' : 'h2'
  const headingClass = headingsAsSubsections
    ? 'text-lg font-semibold text-foreground'
    : 'text-2xl font-semibold text-foreground'

  return (
    <div className="flex w-full flex-col items-stretch gap-6 text-left">
      <TopVoterIssuesSection
        ballotReadyPositionId={ballotReadyPositionId}
        city={city}
        state={state}
        office={office}
        headingsAsSubsections={headingsAsSubsections}
      />

      <div className="space-y-2">
        <HeadingTag className={headingClass}>Voter Demographics</HeadingTag>
        {locationLabel ? (
          <p className="text-sm leading-6 text-muted-foreground">
            A snapshot of who lives, votes, and pays attention in{' '}
            <span className="font-semibold text-foreground">
              {locationLabel}
            </span>
            .
          </p>
        ) : null}
      </div>

      <NumberInsight
        title="Total Voters"
        value={chartData.totalConstituents || 0}
        icon={<UsersRound />}
        isLoading={isLoading}
        error={error}
        testID="onboarding-total-voters"
      />

      <DataVisualizationInsight
        chartType="barList"
        percentage={true}
        title="Age Distribution"
        description="We'll help you tailor your outreach mix to each age group — leaning into SMS and social for younger voters, and prioritizing mail and door-knocks for older ones."
        data={chartData.ageDistribution}
        isLoading={isLoading}
        error={error}
      />

      <DataVisualizationInsight
        chartType="donut"
        percentage={true}
        title="Has Children Under 18"
        description="We'll help you reach households with kids using messaging that resonates with them — schools, safety, and after-school programs."
        data={chartData.presenceOfChildren}
        isLoading={isLoading}
        error={error}
      />

      <DataVisualizationInsight
        chartType="donut"
        percentage={true}
        title="Homeowner"
        description="We'll help you focus your door-knocking and direct mail on homeowners when property taxes, zoning, and services are central to your platform."
        data={chartData.homeowner}
        isLoading={isLoading}
        error={error}
      />

      <DataVisualizationInsight
        chartType="barList"
        percentage={true}
        title="Estimated Income Range"
        description="We'll help you frame your economic messaging across SMS, email, and canvassing scripts so it lands with each income segment."
        data={chartData.estimatedIncomeRange}
        isLoading={isLoading}
        error={error}
      />

      <DataVisualizationInsight
        chartType="barList"
        percentage={true}
        title="Education"
        description="We'll help you tune the depth and channel of your outreach (SMS, email, literature drops) to match how each education segment consumes information."
        data={chartData.education}
        isLoading={isLoading}
        error={error}
      />

      {showLocalNewsSources ? (
        <LocalNewsSourcesSection city={city} state={state} office={office} />
      ) : null}
    </div>
  )
}
