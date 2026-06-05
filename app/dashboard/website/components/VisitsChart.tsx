'use client'

import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

export interface VisitsChartDataPoint {
  weekday: string
  visitors: number
  date: Date
}

export default function VisitsChart({
  data,
}: {
  data: VisitsChartDataPoint[]
}): React.JSX.Element {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
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
              return format(payload[0].payload.date, 'MMM d, yyyy')
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
  )
}
