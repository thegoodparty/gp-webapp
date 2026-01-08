'use client'
import H2 from '@shared/typography/H2'
import Paper from '@shared/utils/Paper'
import { Bar } from 'react-chartjs-2'
import interactionsColors from './interactionsColors'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import slugify from 'slugify'
import { EcanvasserSummary } from './DoorKnockingPage'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
)

interface InteractionsByDayProps {
  summary?: EcanvasserSummary
}

const InteractionsByDay = ({ summary }: InteractionsByDayProps): React.JSX.Element => {
  const { interactionsByDay } = summary || {}

  const processChartData = () => {
    if (!interactionsByDay) return null

    const allTypes = new Set<string>()
    Object.values(interactionsByDay).forEach((dayData) => {
      if (dayData) {
        Object.keys(dayData).forEach((key) => {
          if (key !== 'count') allTypes.add(key)
        })
      }
    })
    const interactionTypes = Array.from(allTypes)

    const dates: string[] = []
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      if (dateString) {
        dates.push(dateString)
      }
    }

    const labels = dates.map((date) => new Date(date).toLocaleDateString())

    const datasets = interactionTypes.map((interactionType) => ({
      label: interactionType,
      data: dates.map((date) => {
        const dayData = interactionsByDay[date]
        return dayData ? dayData[interactionType] || 0 : 0
      }),
      backgroundColor: interactionsColors[slugify(interactionType, { lower: true })] || '#CBD5E1',
    }))

    return {
      labels,
      datasets,
    }
  }

  const options: ChartOptions<'bar'> = {
    plugins: {
      title: {
        display: false,
      },
      legend: {
        position: 'bottom',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  }

  const chartData = processChartData()

  return (
    <Paper className="md:p-6 mt-4">
      <H2 className="mb-8">Interactions Over Time</H2>
      <div className="">
        <div className="">
          <div className="h-[400px] flex items-center justify-center">
            {chartData && <Bar options={options} data={chartData} />}
          </div>
        </div>
      </div>
    </Paper>
  )
}

export default InteractionsByDay
