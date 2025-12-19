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

interface User {
  firstName: string
}

interface UpdateHistoryItem {
  createdAt: number
  user: User
}

type ChartDataItem = { name: string } & Partial<Record<string, string | number>>

interface UpdateHistoryChartProps {
  updateHistory: UpdateHistoryItem[]
}

const timestampToDate = (ts: number): string => {
  const date = new Date(ts)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`
}

const groupedData = (
  input: UpdateHistoryItem[],
): Partial<Record<string, Partial<Record<string, number>>>> => {
  return input.reduce<Partial<Record<string, Partial<Record<string, number>>>>>(
    (acc, item) => {
      const date = timestampToDate(item.createdAt)
      if (!acc[date]) {
        acc[date] = {}
      }
      const dateData = acc[date]
      if (dateData && !dateData[item.user.firstName]) {
        dateData[item.user.firstName] = 0
      }
      if (dateData) {
        dateData[item.user.firstName] =
          (dateData[item.user.firstName] || 0) + 1
      }
      return acc
    },
    {},
  )
}

const getDatesBetween = (startDate: number, endDate: number): string[] => {
  const dates: string[] = []
  let currentDate = new Date(startDate)
  currentDate.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)

  while (currentDate <= end) {
    dates.push(timestampToDate(currentDate.getTime()))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

const transformedData = (input: UpdateHistoryItem[]): ChartDataItem[] => {
  const data = groupedData(input)

  const minDate = Math.min(...input.map((item) => item.createdAt))
  const maxDate = Math.max(...input.map((item) => item.createdAt))

  const allDates = getDatesBetween(minDate, maxDate)

  const allUsers = [...new Set(input.map((item) => item.user.firstName))]

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
