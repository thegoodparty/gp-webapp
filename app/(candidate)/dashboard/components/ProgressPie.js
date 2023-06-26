'use client';

import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import { kFormatter } from 'helpers/numberHelper';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// import styles from './GoalsChart.module.scss';

export default function ProgressPie({ total, progress }) {
  const data = [
    { name: 'Total', value: total - progress },
    { name: 'So Far', value: progress },
  ];
  let perc = total !== 0 ? parseInt((progress * 100) / total, 10) : 0;
  if (perc > 100) {
    perc = 100;
  }

  let COLORS = ['#DEE1E9', '#13161A'];

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
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              // startAngle={50}
              // endAngle={310}
              fill="#13161A"
              labelLine={false}
              // label={renderCustomizedLabel}
              // isAnimationActive={false}
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
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-lg">
        <div className="text-center">
          <H2 className="text-4xl mb-1">{kFormatter(total - progress)}</H2>
          <Body2>left this week</Body2>
        </div>
      </div>
    </div>
  );
}
