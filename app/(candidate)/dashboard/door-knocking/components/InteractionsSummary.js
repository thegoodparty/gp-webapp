'use client';
import H2 from '@shared/typography/H2';
import Caption from '@shared/typography/Caption';
import Paper from '@shared/utils/Paper';
import { numberFormatter } from 'helpers/numberHelper';

export default function InteractionsSummary({ summary }) {
  console.log('summary', summary);
  const { totalInteractions, interactions, averageRating } = summary || {};
  const {
    answered,
    'call-back': callBack,
    refused,
    'not-home': notHome,
    inaccessible: inaccessible,
  } = interactions || {};

  const fields = [
    {
      label: 'Interactions',
      value: totalInteractions,
    },
    {
      label: 'Answered',
      value: answered,
    },
    {
      label: 'Call Back',
      value: callBack,
    },
    {
      label: 'Refused',
      value: refused,
    },
    {
      label: 'Not Home',
      value: notHome,
    },
    {
      label: 'Inaccessible',
      value: inaccessible,
    },
    {
      label: 'Avg. Rating',
      value: averageRating ? averageRating.toFixed(2) : 0,
    },
    {
      label: 'Conversion Rate',
      value: `${
        totalInteractions
          ? ((answered * 100) / totalInteractions).toFixed(2)
          : 0
      }%`,
    },
  ];
  return (
    <Paper className="md:p-6">
      <H2 className="mb-8">Interactions Summary</H2>
      <div className="grid grid-cols-12 gap-2">
        {fields.map((field) => (
          <div
            className="col-span-6 md:col-span-4 lg:col-span-3 h-full"
            key={field.label}
          >
            <div className="p-3 border rounded-lg border-gray-200 h-full">
              <Caption>{field.label}</Caption>
              <p className="text-3xl  xl:text-4xl font-semibold">
                {field.value || 0}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Paper>
  );
}
/* example summary
{
  "totalContacts": 879,
  "totalHouses": 568,
  "totalInteractions": 41,
  "interactions": {
    "Took Yard Sign": 16,
    "Answered": 6,
    "Not Home": 10,
    "Left Campaign Materials": 5,
    "Inaccessible": 4
  }
}

*/
