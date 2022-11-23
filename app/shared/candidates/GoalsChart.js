/**
 *
 * GoalsChart
 *
 */
'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import styles from './GoalsChart.module.scss';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, index } = props;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const radiusPlus = radius + 20;
  const x = cx + radiusPlus * Math.cos(-startAngle * RADIAN);
  const y = cy + radiusPlus * Math.sin(-startAngle * RADIAN);

  const xBase = cx + radius * Math.cos(-startAngle * RADIAN);
  const yBase = cy + radius * Math.sin(-startAngle * RADIAN);

  return (
    <>
      {index === 1 && (
        <g>
          <foreignObject x={xBase - 10} y={yBase - 10} width={20} height={20}>
            <div className="bg-white h-5 w-5 rounded-full border b-violet-400 relative z-[1]" />
          </foreignObject>
        </g>
      )}
      <g>
        <foreignObject x={x - 10} y={y - 10} width={20} height={20}>
          {index === 1 && <div className="-rotate-90">🗳</div>}
        </foreignObject>
      </g>
    </>
  );
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function GoalsChart({ candidate, followers }) {
  const { likelyVoters, votesNeeded, color } = candidate;
  let voters = likelyVoters;
  if (followers?.thisWeek > likelyVoters) {
    voters = followers.thisWeek;
  }
  const cappedLikely = voters > votesNeeded ? votesNeeded : voters;

  const data = [
    { name: 'To Win', value: votesNeeded - cappedLikely },
    { name: 'So Far', value: cappedLikely },
  ];
  let perc = votesNeeded !== 0 ? parseInt((voters * 100) / votesNeeded, 10) : 0;
  if (perc > 100) {
    perc = 100;
  }
  let brightColor = color?.color ? color.color : '#000000';
  if (brightColor.length === 4) {
    brightColor = brightColor + brightColor.substr(1, 3);
  }
  const rgb = hexToRgb(brightColor);
  const COLORS = [`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`, brightColor];

  return (
    <div className="relative">
      <div
        className={styles.wrapper}
        style={{ height: '150px', transform: 'scaleX(1) rotate(90deg)' }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={90}
              startAngle={50}
              endAngle={310}
              fill={brightColor}
              labelLine={false}
              label={renderCustomizedLabel}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-lg">
        <div className="text-center">
          <div className="text-3xl font-black">{perc}%</div>
          Votes Needed
          <br />
          To Win
        </div>
      </div>
    </div>
  );
}

export default GoalsChart;
