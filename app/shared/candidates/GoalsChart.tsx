'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

import styles from './GoalsChart.module.scss'


interface RGB {
  r: number
  g: number
  b: number
}

export const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result && result[1] && result[2] && result[3]
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

interface Candidate {
  voterProjection?: number
  voteGoal?: number
  finalVotes?: number
}

interface GoalsChartProps {
  candidate: Candidate
  color: string
  additionalVotes?: number
}

const GoalsChart = ({ candidate, color, additionalVotes = 0 }: GoalsChartProps): React.JSX.Element => {
  let { voterProjection, voteGoal, finalVotes } = candidate
  voteGoal = voteGoal || 100
  let voters = additionalVotes + (voterProjection || 0)

  if (finalVotes && finalVotes > 0) {
    voters = finalVotes
  }

  const cappedLikely = voters > voteGoal ? voteGoal : voters

  const data = [
    { name: 'To Win', value: voteGoal - cappedLikely },
    { name: 'So Far', value: cappedLikely },
  ]
  let perc = voteGoal !== 0 ? parseInt(((voters * 100) / voteGoal).toString(), 10) : 0
  if (perc > 100) {
    perc = 100
  }

  const rgb = hexToRgb(color)
  let COLORS = ['#D4DBE4', color]
  if (rgb) {
    COLORS = ['#D4DBE4', color]
  }

  return (
    <div className="relative">
      <div
        className={styles.wrapper}
        style={{ height: '200px', transform: 'scaleX(1) rotate(90deg)' }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={115}
              startAngle={50}
              endAngle={310}
              fill={color || '#000'}
              labelLine={false}
              isAnimationActive={false}
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default GoalsChart

