'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Paper from '@shared/utils/Paper'
import H5 from '@shared/typography/H5'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import Body2 from '@shared/typography/Body2'
import { Button } from '@styleguide'
import ResponsiveModal from '@shared/utils/ResponsiveModal'
import StepList from './StepList'
import H1 from '@shared/typography/H1'
import { useSnackbar } from 'helpers/useSnackbar'
import { format, subDays } from 'date-fns'
import type { VisitsChartDataPoint } from './VisitsChart'

// recharts (+ its d3 deps) is the single largest chunk in the app. Loading the
// chart lazily keeps it out of the website route's initial JS; the panel shell,
// header and modal still render/hydrate immediately.
const VisitsChart = dynamic(() => import('./VisitsChart'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  ),
})

interface Visit {
  createdAt: string
}

type ChartDataPoint = VisitsChartDataPoint

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

export default function WebsiteVisits({
  className = '',
}: WebsiteVisitsProps): React.JSX.Element {
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

  const chartData = useMemo(() => processVisitsData(visits), [visits])
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
        <Button variant="secondary" onClick={() => setModalOpen(true)}>
          Increase visitors
        </Button>
      </div>

      <div className="h-48 w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <VisitsChart data={chartData} />
        )}
      </div>

      <ResponsiveModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <H1 className="text-center mb-8">Increase your website engagement</H1>
        <StepList type="increaseVisitors" forceColumn />
      </ResponsiveModal>
    </Paper>
  )
}
