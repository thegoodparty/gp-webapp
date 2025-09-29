'use client'
import { LuUsersRound } from 'react-icons/lu'
import { TextInsight } from '../TextInsight'
import { NumberInsight } from '../NumberInsight'
import { DataVisualizationInsight } from '../DataVisualizationInsight'

export default function InsightsStep({ }) {

  // TODO: Remove this once the TCR compliance check is ready. Do happy path for now.
  // const [tcrCompliant, isLoadingTcrCompliance, error] = useTcrComplianceCheck()
  const tcrCompliant = true
  const isLoadingTcrCompliance = false

  const insights = [
    {
      title: 'Expect education, safety, and youth services to dominate your agenda.',
      description: '62% of you community is families with school aged children. Most districts are 30-40%.',
    },
    {
      title: 'Expect tension on development, services, and tax priorities.',
      description: 'Your wealth gap is wider than 87% of districts. Most see only 3-4x difference between top and bottom halves.',
    },
    {
      title: 'Expect complaints about truck traffic, road damage, and noise - especially near new rail hubs.',
      description: 'Your industrial growth rate is 5x faster than regional average where most see 8% over two years.',
    },
  ]

  return (
    <div className="flex flex-col items-center md:justify-center mb-28 md:mb-4">
      <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
        These insights will help you maximize your impact as an elected official.
      </h1>
      <p className="text-left md:text-center mt-4 text-lg font-normal text-muted-foreground">
        You will be able to access this information on your constituency profile at anytime.
      </p>
      <div className="w-full items-center flex flex-col gap-8 mt-8">
        <NumberInsight title="Total Constituents" value={15384} icon={<LuUsersRound />} />
        {insights.map((insight, index) => (
          <div key={index} className="col-span-1 flex justify-center w-full">
            <TextInsight title={insight.title} description={insight.description} />
          </div>
        ))}
        <DataVisualizationInsight chartType="horizontalGauge" percentage={true} title="Age Distribution" insight="This data is based on your voter file and may not be 100% accurate." data={[{ name: '18 - 25', value: 15}, { name: '26 - 35', value: 25}, { name: '35 - 50', value: 42}, { name: '50+', value: 15}]} />
        <DataVisualizationInsight chartType="pie" percentage={true} title="Has Children Under 18" insight="This data is based on your voter file and may not be 100% accurate." data={[{ name: 'Yes', value: 62 }, { name: 'No', value: 25}, { name: 'Unknown', value: 13 }]} />
        <DataVisualizationInsight chartType="donut" percentage={true} title="Homeowner" insight="This data is based on your voter file and may not be 100% accurate." data={[{name: 'Yes', value: 42}, {name: 'Likely', value: 18}, {name: 'No', value: 21}, {name: 'Unknown', value: 19}]} />
        <DataVisualizationInsight chartType="verticalBar" percentage={true} title="Estimated Income Range" insight="This data is based on your voter file and may not be 100% accurate." data={[{ name: 'Under $50K', value: 20 }, { name: '$50K - $75K', value: 47 }, { name: '$75K - $100K', value: 31 }, { name: '$100K - $150K', value: 40 }, { name: '$150K+', value: 20 }, { name: 'Unknown', value: 4 }]} />
        <DataVisualizationInsight chartType="horizontalBar" percentage={true} title="Education" insight="This data is based on your voter file and may not be 100% accurate." data={[{name: "None", value: 12}, {name: "High School Diploma", value: 32}, {name: "Technical School", value: 18}, {name: "Some College", value: 25}, {name: "College Degree", value: 14}, {name: "Gradiuate Degree", value: 3}, {name: "Unknown", value: 20}]} />
      </div>
    </div>
  )
}
