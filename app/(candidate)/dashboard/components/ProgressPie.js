'use client';

import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import { kFormatter } from 'helpers/numberHelper';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// import styles from './GoalsChart.module.scss';

const COLORS = ['#DEE1E9', '#13161A'];

export default function ProgressPie({ total, progress }) {
  console.log('typeof total', typeof total);
  console.log('typeof progress', typeof progress);
  const data = [
    { name: 'Total', value: total - progress >= 0 ? total - progress : 0 },
    { name: 'So Far', value: progress },
  ];

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
              // startAngle={50}
              // endAngle={310}
              // fill="#13161A"
              // labelLine={false}
              // label={renderCustomizedLabel}
              // isAnimationActive={false}
            >
              {data.map((entry, index) => {
                console.log('ndex', index);
                console.log(
                  'COLORS[index % COLORS.length]',
                  COLORS[index % COLORS.length],
                );
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    // fill="#EDEDED"
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-lg">
        <div className="text-center">
          <H2 className="text-4xl mb-1">
            {total - progress > 0 ? kFormatter(total - progress) : 0}
          </H2>
          <Body2>left this week</Body2>
        </div>
      </div>
    </div>
  );
}
