'use client';
import H2 from '@shared/typography/H2';
import Paper from '@shared/utils/Paper';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const ratingColors = {
  unrated: '#94A3B8', // gray
  1: '#EF4444', // red
  2: '#F97316', // orange
  3: '#FB923C', // light orange
  4: '#86EFAC', // light green
  5: '#22C55E', // green
};

export default function RatingSummary({ summary }) {
  const { groupedRatings } = summary || {};

  const processChartData = () => {
    if (!groupedRatings) return null;

    // Define the order of ratings we want to display
    const ratingOrder = ['unrated', '1', '2', '3', '4', '5'];

    const labels = ratingOrder.map((rating) =>
      rating === 'unrated'
        ? 'Unrated'
        : `${rating} Star${rating !== '1' ? 's' : ''}`,
    );
    const data = ratingOrder.map((rating) => groupedRatings[rating] || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Number of Ratings',
          data,
          backgroundColor: ratingOrder.map((rating) => ratingColors[rating]),
          borderRadius: 4,
        },
      ],
    };
  };

  const options = {
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false, // Hide legend since we only have one dataset
      },
    },
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Only show whole numbers
        },
      },
    },
    maintainAspectRatio: false,
  };

  const chartData = processChartData();

  return (
    <Paper className="md:p-6 mt-4">
      <H2 className="mb-8">Rating Distribution</H2>
      <div className="h-[400px] flex items-center justify-center">
        {chartData && <Bar options={options} data={chartData} />}
      </div>
    </Paper>
  );
}
