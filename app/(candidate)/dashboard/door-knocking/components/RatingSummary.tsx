'use client'
import H2 from '@shared/typography/H2'
import Paper from '@shared/utils/Paper'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { EcanvasserSummary } from './DoorKnockingPage'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type RatingKey = 'unrated' | '1' | '2' | '3' | '4' | '5'

type RatingColors = {
  unrated: string
  1: string
  2: string
  3: string
  4: string
  5: string
}

const ratingColors: RatingColors = {
  unrated: '#94A3B8',
  1: '#EF4444',
  2: '#F97316',
  3: '#FB923C',
  4: '#86EFAC',
  5: '#22C55E',
}

interface RatingSummaryProps {
  summary?: EcanvasserSummary
}

const RatingSummary = ({ summary }: RatingSummaryProps): React.JSX.Element => {
  const { groupedRatings } = summary || {}

  const processChartData = () => {
    if (!groupedRatings) return null

    const ratingOrder: RatingKey[] = ['unrated', '1', '2', '3', '4', '5']

    const labels = ratingOrder.map((rating) =>
      rating === 'unrated'
        ? 'Unrated'
        : `${rating} Star${rating !== '1' ? 's' : ''}`,
    )
    const data = ratingOrder.map((rating) => groupedRatings[rating] || 0)

    return {
      labels,
      datasets: [
        {
          label: 'Number of Ratings',
          data,
          backgroundColor: ratingOrder.map((rating) => ratingColors[rating]),
          borderRadius: 4,
        },
      ],
    }
  }

  const options = {
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
    maintainAspectRatio: false,
  }

  const chartData = processChartData()

  return (
    <Paper className="md:p-6 mt-4">
      <H2 className="mb-8">Rating Distribution</H2>
      <div className="h-[400px] flex items-center justify-center">
        {chartData && <Bar options={options} data={chartData} />}
      </div>
    </Paper>
  )
}

export default RatingSummary
