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

function timestampToDate(ts) {
  const date = new Date(ts)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`
}

const groupedData = (input) => {
  return input.reduce((acc, item) => {
    const date = timestampToDate(item.createdAt)
    if (!acc[date]) {
      acc[date] = {}
    }
    if (!acc[date][item.user.firstName]) {
      acc[date][item.user.firstName] = 0
    }
    acc[date][item.user.firstName]++
    return acc
  }, {})
}

function getDatesBetween(startDate, endDate) {
  const dates = []
  let currentDate = new Date(startDate)
  currentDate.setHours(0, 0, 0, 0) // Reset time to midnight
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0) // Reset time to midnight

  while (currentDate <= end) {
    dates.push(timestampToDate(currentDate.getTime()))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

const transformedData = (input) => {
  const data = groupedData(input)

  // Find the min and max dates from the input
  const minDate = Math.min(...input.map((item) => item.createdAt))
  const maxDate = Math.max(...input.map((item) => item.createdAt))

  // Get all dates between min and max
  const allDates = getDatesBetween(minDate, maxDate)

  // Extract all unique users from the input data
  const allUsers = [...new Set(input.map((item) => item.user.firstName))]

  // Merge with actual data
  return allDates.map((date) => {
    const dateData = { name: date }
    allUsers.forEach((user) => {
      dateData[user] = data[date] && data[date][user] ? data[date][user] : 0
    })
    return dateData
  })
}

export default function UpdateHistoryChart(props) {
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
        {allUsers.map((user, index) => (
          <Line
            key={user}
            type="monotone"
            dataKey={user}
            stroke="#8884d8" // Optional: Get a unique color for each user
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
