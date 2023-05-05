import { Fragment } from 'react';

const tableCols = [
  {
    date: 'May 31st',
    subject: 'The “Why”: Kickoff GPA & Finding your Why',
  },
  {
    date: 'June 7th',
    subject: 'The “How”: Building a Campaign Plan',
  },
  {
    date: 'June 14th',
    subject: 'The “Who + How Much”: Building a Team and Support',
  },
  {
    date: 'June 21st',
    subject: 'The “What”: Graduate and Making a Decision',
  },
];

export default function Timeline() {
  return (
    <div className="mt-28 grid grid-cols-12">
      <div className=" col-span-12 lg:col-span-8">
        <h2 className="font-black text-5xl mb-5">Course Timeline</h2>
        <p className="text-2xl mb-12">
          Good Party Academy is currently running its first cohort, but will run
          another in May 2023.
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
