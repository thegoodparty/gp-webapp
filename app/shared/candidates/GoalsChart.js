/**
 *
 * GoalsChart
 *
 */
'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

import styles from './GoalsChart.module.scss'

const RADIAN = Math.PI / 180
const renderCustomizedLabel = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, index } = props

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const radiusPlus = radius + 20
  const x = cx + radiusPlus * Math.cos(-startAngle * RADIAN)
  const y = cy + radiusPlus * Math.sin(-startAngle * RADIAN)

  const xBase = cx + radius * Math.cos(-startAngle * RADIAN)
  const yBase = cy + radius * Math.sin(-startAngle * RADIAN)

  return (
    <>
      {index === 1 && (
        <g>
          <foreignObject x={xBase - 10} y={yBase - 10} width={20} height={20}>
            <div className="bg-white h-5 w-5 rounded-full border b-violet-400 relative z-[1]" />
          </foreignObject>
        </g>
      )}
      {/* <g>
        <foreignObject x={x - 10} y={y - 10} width={20} height={20}>
          {index === 1 && <div className="-rotate-90">🗳</div>}
        </foreignObject>
      </g> */}
    </>
  )
}

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function GoalsChart({ candidate, color, additionalVotes = 0 }) {
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
  let perc = voteGoal !== 0 ? parseInt((voters * 100) / voteGoal, 10) : 0
  if (perc > 100) {
    perc = 100
  }

  const rgb = hexToRgb(color)
  let COLORS = ['#D4DBE4', color]
  if (rgb) {
    // COLORS = [`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`, color];
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
              // label={renderCustomizedLabel}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  // fill="#EDEDED"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-lg">
        <div className="text-center">
          <div className="text-3xl font-black">{perc || 0}%</div>
          <div className="font-bold mt-3 text-xl">of votes</div>
          <div className="text-sm">needed to Win</div>
        </div>
      </div> */}
    </div>
  )
}

export default GoalsChart
