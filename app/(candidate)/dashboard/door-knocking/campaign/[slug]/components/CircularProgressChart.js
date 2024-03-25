'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import styles from './CircularProgressChart.module.scss';

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function CircularProgressChart({
  goal = 100,
  progress = 0,
  color = '#000000',
}) {
  const cappedLikely = progress > goal ? goal : progress;

  const data = [
    { name: 'Goal', value: goal - cappedLikely },
    { name: 'Progress', value: cappedLikely },
  ];
  let perc = goal !== 0 ? parseInt((progress * 100) / goal, 10) : 0;
  if (perc > 100) {
    perc = 100;
  }
  const COLORS = ['#D4DBE4', color];

  return (
    <div className="relative">
      <div
        className={styles.wrapper}
        style={{
          height: '150px',
          width: '150px',
          transform: 'scaleX(1) rotate(90deg)',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={200} height={150}>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={90}
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
    </div>
  );
}

export default CircularProgressChart;
