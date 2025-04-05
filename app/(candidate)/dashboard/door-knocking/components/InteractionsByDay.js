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
} from 'chart.js'
import { slugify } from 'helpers/articleHelper'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
)

export default function InteractionsSummaryPie({ summary }) {
  const { totalInteractions, interactionsByDay } = summary || {}

  // Process data for the chart
  const processChartData = () => {
    if (!interactionsByDay) return null

    // Get all unique interaction types
    const allTypes = new Set()
    Object.values(interactionsByDay).forEach((dayData) => {
      Object.keys(dayData).forEach((key) => {
        if (key !== 'count') allTypes.add(key)
      })
    })
    const interactionTypes = Array.from(allTypes)

    // Generate array of last 30 days
    const dates = []
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }

    // Format dates for display
    const labels = dates.map((date) => new Date(date).toLocaleDateString())

    // Create datasets with zero-filled data for missing days
    const datasets = interactionTypes.map((type) => ({
      label: type,
      data: dates.map((date) => {
        const dayData = interactionsByDay[date]
        return dayData ? dayData[type] || 0 : 0
      }),
      backgroundColor: interactionsColors[slugify(type, true)] || '#CBD5E1', // Fallback color if not found
    }))

    return {
      labels,
      datasets,
    }
  }

  const options = {
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
