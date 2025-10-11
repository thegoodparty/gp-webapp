'use client'
import { LuUsersRound } from 'react-icons/lu'
import { TextInsight } from '../TextInsight'
import { NumberInsight } from '../NumberInsight'
import { DataVisualizationInsight } from '../DataVisualizationInsight'
import { useContactsStats } from '../../../contexts/ContactsStatsContext'
import { mapContactsStatsToCharts } from '../../utils/mapContactsStatsToCharts'
import { useEffect, useMemo } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

export default function InsightsStep({ }) {

  const { contactsStats, isLoading, error } = useContactsStats()
  
  // Map the API data to chart format
  const chartData = useMemo(() => mapContactsStatsToCharts(contactsStats), [contactsStats])

  useEffect(() => {
    trackEvent(EVENTS.ServeOnboarding.ConstituencyProfileViewed)
  }, [])

  // TODO: Remove this once the TCR compliance check is ready. Do happy path for now.
  // const [tcrCompliant, isLoadingTcrCompliance, error] = useTcrComplianceCheck()
  const tcrCompliant = true
  const isLoadingTcrCompliance = false

  // temporary placeholder for insights. Constituent insights are coming soon.
  const insights = []

  return (
    <div className="flex flex-col items-center md:justify-center mb-28 md:mb-4">
      <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
        These insights will help you maximize your impact as an elected official.
      </h1>
      <p className="text-left md:text-center mt-4 text-lg font-normal text-muted-foreground">
        You will be able to access this information on your constituency profile at anytime.
      </p>
      <div className="w-full items-center flex flex-col gap-8 mt-8">
        <NumberInsight 
          title="Total Constituents" 
          value={chartData.totalConstituents || 0} 
          icon={<LuUsersRound />} 
          isLoading={isLoading}
          error={error}
        />
        {insights.map((insight, index) => (
          <div key={index} className="col-span-1 flex justify-center w-full">
            <TextInsight title={insight.title} description={insight.description} isLoading={isLoading} error={error} />
          </div>
        ))}
        
        {/* Age Distribution Chart */}
        <DataVisualizationInsight 
          chartType="horizontalGauge" 
          percentage={true} 
          title="Age Distribution" 
          insight="This data is based on your voter file and may not be 100% accurate." 
          data={chartData.ageDistribution} 
          isLoading={isLoading}
          error={error}
        />
        
        {/* Presence of Children Chart */}
        <DataVisualizationInsight 
          chartType="pie" 
          percentage={true} 
          title="Has Children Under 18" 
          insight="This data is based on your voter file and may not be 100% accurate." 
          data={chartData.presenceOfChildren} 
          isLoading={isLoading}
          error={error}
        />
        
        {/* Homeowner Chart */}
        <DataVisualizationInsight 
          chartType="donut" 
          percentage={true} 
          title="Homeowner" 
          insight="This data is based on your voter file and may not be 100% accurate." 
          data={chartData.homeowner} 
          isLoading={isLoading}
          error={error}
        />
        
        {/* Estimated Income Range Chart */}
        <DataVisualizationInsight 
          chartType="verticalBar" 
          percentage={true} 
          title="Estimated Income Range" 
          insight="This data is based on your voter file and may not be 100% accurate." 
          data={chartData.estimatedIncomeRange} 
          isLoading={isLoading}
          error={error}
        />
        
        {/* Education Chart */}
        <DataVisualizationInsight 
          chartType="horizontalBar" 
          percentage={true} 
          title="Education" 
          insight="This data is based on your voter file and may not be 100% accurate." 
          data={chartData.education} 
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  )
}
