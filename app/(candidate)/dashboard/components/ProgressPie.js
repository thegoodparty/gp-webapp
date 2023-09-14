'use client';

import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import { kFormatter } from 'helpers/numberHelper';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// import styles from './GoalsChart.module.scss';

const COLORS = ['#DEE1E9', '#13161A'];
const COLORS_OVER = ['#44F1A7', '#0EB66F'];

export default function ProgressPie({ total, progress }) {
  let overMode = total - progress < 0;

  let data;
  if (overMode) {
    data = [
      { name: 'Total', value: total },
      { name: 'So Far', value: total / 5 },
    ];
  } else {
    data = [
      { name: 'Total', value: total - progress },
      { name: 'So Far', value: progress },
    ];
  }

  return (
    <div className="relative">
      <div
        // className={styles.wrapper}
        style={{ height: '160px', transform: 'rotate(270deg)' }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={160} height={160}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    overMode
                      ? COLORS_OVER[index % COLORS.length]
                      : COLORS[index % COLORS.length]
                  }
                  // fill="#EDEDED"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-lg">
        <div className="text-center">
          <H2 className={`text-4xl mb-1 ${overMode ? 'text-green-500' : ''}`}>
            {overMode && '+'}
            {overMode
              ? -1 * kFormatter(total - progress)
              : kFormatter(total - progress)}
          </H2>
          <Body2>left this week</Body2>
        </div>
      </div>
    </div>
  );
}
