'use client'
import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { CampaignUpdateHistory } from 'helpers/types'

interface ChartDataItem {
  name: string
  [userName: string]: string | number
}

interface GroupedDateData {
  [userName: string]: number
}

interface GroupedData {
  [date: string]: GroupedDateData
}

interface UpdateHistoryChartProps {
  updateHistory: CampaignUpdateHistory[]
}

const timestampToDate = (ts: Date | string): string => {
  const date = new Date(ts)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`
}

const groupedData = (input: CampaignUpdateHistory[]): GroupedData => {
  return input.reduce<GroupedData>((acc, item) => {
    const date = timestampToDate(item.createdAt)
    if (!acc[date]) {
      acc[date] = {}
    }
    const dateData = acc[date]
    if (dateData && !dateData[item.user.firstName || '']) {
      dateData[item.user.firstName || ''] = 0
    }
    if (dateData) {
      dateData[item.user.firstName || ''] =
        (dateData[item.user.firstName || ''] || 0) + 1
    }
    return acc
  }, {})
}

const getDatesBetween = (startDate: Date, endDate: Date): string[] => {
  const dates: string[] = []
  let currentDate = new Date(startDate)
  currentDate.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)

  while (currentDate <= end) {
    dates.push(timestampToDate(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

const transformedData = (input: CampaignUpdateHistory[]): ChartDataItem[] => {
  const data = groupedData(input)

  const minDate = new Date(
    Math.min(...input.map((item) => new Date(item.createdAt).getTime())),
  )
  const maxDate = new Date(
    Math.max(...input.map((item) => new Date(item.createdAt).getTime())),
  )

  const allDates = getDatesBetween(minDate, maxDate)

  const allUsers = [...new Set(input.map((item) => item.user.firstName || ''))]

  return allDates.map((date) => {
    const dateData: ChartDataItem = { name: date }
    allUsers.forEach((user) => {
      dateData[user] = data[date]?.[user] || 0
    })
    return dateData
  })
}

export default function UpdateHistoryChart(
  props: UpdateHistoryChartProps,
): React.JSX.Element {
  const { updateHistory } = props
  const data = transformedData(updateHistory)
  const allUsers = [
    ...new Set(
      data.flatMap((item) => Object.keys(item)).filter((key) => key !== 'name'),
    ),
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {allUsers.map((user) => (
          <Line
            key={user}
            type="monotone"
            dataKey={user}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
