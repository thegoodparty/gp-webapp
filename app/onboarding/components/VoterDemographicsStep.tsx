'use client'
import { useMemo } from 'react'
import { useQuery, queryOptions } from '@tanstack/react-query'
import { LuUsersRound } from 'react-icons/lu'
import { clientRequest } from 'gpApi/typed-request'
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

  const isLoading =
    query.isPending && Boolean(ballotReadyPositionId || districtId)
  const error = query.error?.message

  const chartData = useMemo(
    () => mapContactsStatsToCharts(query.data),
    [query.data],
  )

  return (
    <div className="flex w-full flex-col items-stretch gap-6 text-left">
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
        insight="Tailor your messaging and outreach channels to the age groups most represented in your district."
        data={chartData.ageDistribution}
        isLoading={isLoading}
        error={error}
      />

      <DataVisualizationInsight
        chartType="pie"
        percentage={true}
        title="Has Children Under 18"
        insight="Households with kids tend to prioritize schools, safety, and family-focused policies."
        data={chartData.presenceOfChildren}
        isLoading={isLoading}
        error={error}
      />

      <DataVisualizationInsight
        chartType="donut"
        percentage={true}
        title="Homeowner"
        insight="Homeowners often care most about property taxes, zoning, and neighborhood services."
        data={chartData.homeowner}
        isLoading={isLoading}
        error={error}
      />

      <DataVisualizationInsight
        chartType="verticalBar"
        percentage={true}
        title="Estimated Income Range"
        insight="Knowing your district's income mix helps you frame economic issues that resonate with voters."
        data={chartData.estimatedIncomeRange}
        isLoading={isLoading}
        error={error}
      />

      <DataVisualizationInsight
        chartType="horizontalBar"
        percentage={true}
        title="Education"
        insight="Education levels shape how voters consume information and which issues feel most urgent."
        data={chartData.education}
        isLoading={isLoading}
        error={error}
      />

      <LocalNewsSourcesSection city={city} state={state} office={office} />
    </div>
  )
}
