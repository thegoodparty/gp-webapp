import { Fragment } from 'react';

const tableCols = [
  { date: 'April 3rd', subject: 'Kickoff Good Party Academy' },
  {
    date: 'April 3rd - April 7th',
    subject: 'Introducing A New Way To Run For Office',
  },
  { date: 'April 10th - April 14th', subject: 'Planning a Campaign' },
  { date: 'May 8th - May 19th', subject: 'Running a Campaign' },
  {
    date: 'May 22nd - June 2nd ',
    subject: 'Winning, Serving and What To Do Next',
  },
  { date: 'June 2nd', subject: 'Good Party Academy Graduation' },
];

export default function Timeline() {
  return (
    <div className="mt-28 grid grid-cols-12">
      <div className=" col-span-12 lg:col-span-8">
        <h2 className="font-black text-5xl mb-5">Course Timeline</h2>
        <p className="text-2xl mb-12">
          Good Party Academy is set to run from April 3rd to June 2nd.
          You&apos;ll be expected to join a cohort of 12 candidates and join us
          for programming 5-8 hours/week.{' '}
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
