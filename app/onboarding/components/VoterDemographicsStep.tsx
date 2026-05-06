'use client'
import { useEffect, useMemo } from 'react'
import { useQuery, queryOptions } from '@tanstack/react-query'
import { LuUsersRound } from 'react-icons/lu'
import { clientRequest } from 'gpApi/typed-request'
import { reportErrorToSentry } from '@shared/sentry'
import { NumberInsight } from 'app/polls/onboarding/components/NumberInsight'
import { DataVisualizationInsight } from 'app/polls/onboarding/components/DataVisualizationInsight'
import { mapContactsStatsToCharts } from 'app/polls/onboarding/utils/mapContactsStatsToCharts'
import { LocalNewsSourcesSection } from './LocalNewsSourcesSection'

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
}

export const VoterDemographicsStep = ({
  ballotReadyPositionId,
  districtId,
  city,
  state,
  office,
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

  return (
    <div className="flex w-full flex-col items-stretch gap-6 text-left">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Voter Demographics
        </h2>
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
        icon={<LuUsersRound />}
        isLoading={isLoading}
        error={error}
        testID="onboarding-total-voters"
      />

      <DataVisualizationInsight
        chartType="horizontalGauge"
        percentage={true}
        title="Age Distribution"
        description="Use this to pick the right outreach mix — younger voters lean into SMS and social, older voters respond best to mail and door-knocks."
        data={chartData.ageDistribution}
        isLoading={isLoading}
        error={error}
      />

      <DataVisualizationInsight
        chartType="pie"
        percentage={true}
        title="Has Children Under 18"
        description="Households with kids prioritize schools, safety, and after-school programs — message and canvas these blocks accordingly."
        data={chartData.presenceOfChildren}
        isLoading={isLoading}
        error={error}
      />

      <DataVisualizationInsight
        chartType="donut"
        percentage={true}
        title="Homeowner"
        description="Homeowners care about property taxes, zoning, and services — focus door-knocking and direct mail here when those issues are central to your platform."
        data={chartData.homeowner}
        isLoading={isLoading}
        error={error}
      />

      <DataVisualizationInsight
        chartType="verticalBar"
        percentage={true}
        title="Estimated Income Range"
        description="Knowing the income mix helps you frame economic messaging in your SMS, email, and canvassing scripts so it lands with each segment."
        data={chartData.estimatedIncomeRange}
        isLoading={isLoading}
        error={error}
      />

      <DataVisualizationInsight
        chartType="horizontalBar"
        percentage={true}
        title="Education"
        description="Education levels shape how voters consume info — tune the depth and channel of your outreach (SMS, email, literature drops) to match."
        data={chartData.education}
        isLoading={isLoading}
        error={error}
      />

      <LocalNewsSourcesSection city={city} state={state} office={office} />
    </div>
  )
}
