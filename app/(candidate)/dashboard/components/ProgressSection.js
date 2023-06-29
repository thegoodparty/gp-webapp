import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import H4 from '@shared/typography/H4';
import { Fragment } from 'react';
import { FaBullhorn } from 'react-icons/fa';
import { RiDoorOpenLine, RiPhoneLine } from 'react-icons/ri';

const rows = [
  { title: 'Doors', icon: <RiDoorOpenLine />, fullWeeks: 3, partWeek: 0.3 },
  { title: 'Calls', icon: <RiPhoneLine />, fullWeeks: 4, partWeek: 0.7 },
  { title: 'Ads', icon: <FaBullhorn />, fullWeeks: 2, partWeek: 0 },
];

export default function ProgressSection(props) {
  return (
    <section>
      <div className="mt-5 mb-3">
        <H3>Campaign Progress</H3>
      </div>
      <div className="bg-slate-200 rounded-3xl py-6 px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <H4>9 weeks left</H4>
            <Body2 className="ml-3">May 15-21, 2023</Body2>
          </div>
          <div>on track</div>
        </div>
        <div className="grid grid-cols-12 mt-4 lg:mt-6">
          <div className=" col-span-1 text-[11px] text-indigo-200 font-sfpro hidden lg:block">
            Weeks left
          </div>
          <div className=" col-span-11  hidden lg:block">
            <div className="grid grid-cols-12 gap-1">
              {[...Array(11).keys()].map((index) => (
                <div
                  key={index}
                  className="col-span-1  text-[11px] text-indigo-200 font-sfpro"
                >
                  {12 - index}
                  {index === 0 ? '+' : ''} weeks
                </div>
              ))}
              <div className="col-span-1  text-[11px] text-indigo-200 font-sfpro">
                Election
              </div>
            </div>
          </div>
          {/*  Second Row */}
          {rows.map((row) => (
            <Fragment key={row.title}>
              <div className="col-span-1 text-[11px] text-indigo-800 font-sfpro flex items-center mt-6">
                {row.icon}{' '}
                <div className="ml-2 hidden lg:block">{row.title}</div>
              </div>
              <div className=" col-span-11 mt-6">
                <div className="grid grid-cols-12 lg:gap-[1px]">
                  {[...Array(12).keys()].map((index) => (
                    <div
                      key={index}
                      className={`relative overflow-hidden col-span-1 bg-gray-400 ${
                        index === 0 ? ' rounded-l-full' : ''
                      } ${index === 11 ? ' rounded-r-full' : ''}`}
                    >
                      {row.fullWeeks > index ? (
                        <div className="absolute w-full h-full left-0 top-0 bg-primary"></div>
                      ) : (
                        <>
                          {row.fullWeeks === index && row.partWeek !== 0 ? (
                            <div
                              className="absolute h-full left-0 top-0 bg-primary rounded-r-full"
                              style={{ width: `${row.partWeek * 100}%` }}
                            ></div>
                          ) : (
                            <div>&nbsp;</div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
