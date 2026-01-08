'use client'

import { useState, useEffect } from 'react'
import Paper from '@shared/utils/Paper'
import H5 from '@shared/typography/H5'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import Body2 from '@shared/typography/Body2'
import Button from '@shared/buttons/Button'
import ResponsiveModal from '@shared/utils/ResponsiveModal'
import StepList from './StepList'
import H1 from '@shared/typography/H1'
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useSnackbar } from 'helpers/useSnackbar'
import { format, subDays } from 'date-fns'

interface Visit {
  createdAt: string
}

interface ChartDataPoint {
  weekday: string
  visitors: number
  date: Date
}

interface WebsiteVisitsProps {
  className?: string
}

async function fetchVisits(): Promise<{ ok: boolean; data: Visit[] }> {
  return await clientFetch<Visit[]>(apiRoutes.website.getViews)
}

function processVisitsData(visits: Visit[]): ChartDataPoint[] {
  const visitsByDate = new Map<string, number>()

  visits.forEach((visit) => {
    const visitDate = new Date(visit.createdAt)
    const dateKey = format(visitDate, 'yyyy-MM-dd')
    visitsByDate.set(dateKey, (visitsByDate.get(dateKey) || 0) + 1)
  })

  const result: ChartDataPoint[] = []
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i)
    const dateKey = format(d, 'yyyy-MM-dd')
    result.push({
      weekday: format(d, 'EEE'),
      visitors: visitsByDate.get(dateKey) || 0,
      date: d,
    })
  }
  return result
}

export default function WebsiteVisits({ className = '' }: WebsiteVisitsProps): React.JSX.Element {
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { errorSnackbar } = useSnackbar()

  useEffect(() => {
    loadVisits()

    async function loadVisits(): Promise<void> {
      setLoading(true)
      const resp = await fetchVisits()
      if (resp.ok) {
        setVisits(resp.data)
      } else {
        errorSnackbar('Failed to load visits')
      }
      setLoading(false)
    }
  }, [])

  const chartData = processVisitsData(visits)
  const totalVisitors = visits.length

  return (
    <Paper className={`!p-4 lg:!p-6 !rounded-lg ${className}`}>
      <div className="flex justify-between items-center gap-2 mb-6">
        <div>
          <H5>
            {totalVisitors} {totalVisitors === 1 ? 'Visitor' : 'Visitors'}
          </H5>
          <Body2 className="mt-1 text-gray-500 text-xs">Last 7 days</Body2>
        </div>
        <Button color="neutral" onClick={() => setModalOpen(true)}>
          Increase visitors
        </Button>
      </div>

      <div className="h-48 w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 0, right: 10, left: 15, bottom: 0 }}
            >
              <XAxis
                dataKey="weekday"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: '#374151', fontWeight: '600' }}
                labelFormatter={(_, payload) => {
                  if (payload && payload.length > 0 && payload[0]?.payload?.date) {
                    const date = payload[0].payload.date
                    return format(date, 'MMM d, yyyy')
                  }
                  return ''
                }}
              />
              <Line
                type="linear"
                dataKey="visitors"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <ResponsiveModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <H1 className="text-center mb-8">Increase your website engagement</H1>
        <StepList type="increaseVisitors" forceColumn />
      </ResponsiveModal>
    </Paper>
  )
}
