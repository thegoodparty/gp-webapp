import { Fragment } from 'react';

const tableCols = [
  {
    date: 'April 10th',
    subject: 'The “Why”: Kickoff GPA & Finding your Why',
  },
  {
    date: 'April 17th- April 21st',
    subject: 'The “How”: Building a Campaign Plan',
  },
  {
    date: 'April 24th- April 28th',
    subject: 'The “Who + How Much”: Building a Team and Support',
  },
  {
    date: 'May 1st- May 5th',
    subject: 'The “What”: Graduate and Making a Decision',
  },
];

export default function Timeline() {
  return (
    <div className="mt-28 grid grid-cols-12">
      <div className=" col-span-12 lg:col-span-8">
        <h2 className="font-black text-5xl mb-5">Course Timeline</h2>
        <p className="text-2xl mb-12">
          The first cohort of Good Party Academy will run from April 10th to May
          5th. You&apos;ll be expected to join a cohort of 6-12 participants and
          join us for programming 2-3 hours/week, including group learning and
          dedicated 1-on-1 sessions.
        </p>
        <div className="mt-10 grid grid-cols-12">
          <div className="col-span-12 bg-black text-white font-black py-2 px-3">
            2023
          </div>
          {tableCols.map((col, index) => (
            <Fragment key={col.date}>
              <div
                className={` py-2 px-3 col-span-4 font-black border-r-2 border-gray-300 ${
                  index % 2 !== 0 && 'bg-gray-100'
                }`}
              >
                {col.date}
              </div>
              <div
                className={` py-2 px-3 col-span-8 ${
                  index % 2 !== 0 && 'bg-gray-100'
                }`}
              >
                {col.subject}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
