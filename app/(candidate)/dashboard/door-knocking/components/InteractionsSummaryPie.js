'use client';
import H2 from '@shared/typography/H2';
import Paper from '@shared/utils/Paper';
import { numberFormatter } from 'helpers/numberHelper';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';
import { Fragment } from 'react';
import interactionsColors from './interactionsColors';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

export default function InteractionsSummaryPie({ summary }) {
  const { totalInteractions, interactions } = summary || {};
  const {
    answered,
    'call-back': callBack,
    refused,
    'not-home': notHome,
    inaccessible: inaccessible,
    'took-yard-sign': tookYardSign,
    'left-campaign-materials': leftCampaignMaterials,
    moved,
  } = interactions || {};

  const fields = [
    {
      label: 'Answered',
      value: answered,
      color: interactionsColors.answered,
    },
    {
      label: 'Call Back',
      value: callBack,
      color: interactionsColors['call-back'],
    },
    {
      label: 'Refused',
      value: refused,
      color: interactionsColors.refused,
    },
    {
      label: 'Not Home',
      value: notHome,
      color: interactionsColors['not-home'],
    },
    {
      label: 'Inaccessible',
      value: inaccessible,
      color: interactionsColors.inaccessible,
    },
    {
      label: 'Took Yard Sign',
      value: tookYardSign,
      color: interactionsColors['took-yard-sign'],
    },
    {
      label: 'Left Campaign Materials',
      value: leftCampaignMaterials,
      color: interactionsColors['left-campaign-materials'],
    },
    {
      label: 'Moved',
      value: moved,
      color: interactionsColors.moved,
    },
  ]
    .filter((field) => field.value > 0)
    .sort((a, b) => b.value - a.value); // Sort fields by value in descending order

  const data = {
    labels: fields.map((field) => field.label),
    datasets: [
      {
        data: fields.map((field) => field.value),
        backgroundColor: fields.map((field) => field.color),
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = ((value / totalInteractions) * 100).toFixed(1);
            return `${context.label}: ${percentage}% (${value})`;
          },
        },
      },
      legend: {
        display: false, // Hide default legend
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <Paper className="md:p-6">
      <H2 className="mb-8">Interactions Status Breakdown</H2>
      <div className="">
        <div className="">
          <div className="h-[400px] flex items-center justify-center">
            <Doughnut data={data} options={options} />
          </div>
        </div>
        <div className="mt-12">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-12">
                {fields.map((field) => (
                  <Fragment key={field.label}>
                    <div className="col-span-2 px-4 py-2 border-b">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: field.color }}
                      />
                    </div>
                    <div className="col-span-6 px-4 py-2 border-b">
                      {field.label}
                    </div>
                    <div className="col-span-2 px-4 py-2 text-right border-b">
                      {numberFormatter(field.value)}
                    </div>
                    <div className="col-span-2 px-4 py-2 text-right border-b">
                      {((field.value / totalInteractions) * 100).toFixed(1)}%
                    </div>
                  </Fragment>
                ))}
                <div className="col-span-8 px-4 py-2 bg-gray-50 font-semibold">
                  Total
                </div>
                <div className="col-span-2 px-4 py-2 text-right bg-gray-50 font-semibold">
                  {numberFormatter(totalInteractions)}
                </div>
                <div className="col-span-2 px-4 py-2 text-right bg-gray-50 font-semibold">
                  100%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
}
