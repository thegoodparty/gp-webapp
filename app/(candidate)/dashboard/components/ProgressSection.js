import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import H4 from '@shared/typography/H4';
import { Fragment } from 'react';
import { FaBullhorn } from 'react-icons/fa';
import { RiDoorOpenLine, RiPhoneLine } from 'react-icons/ri';
import {
  calculateAccumulatedByWeek,
  calculateOnTrack,
} from './voterGoalsHelpers';
import ProgressPill from './ProgressPill';

const rows = [
  {
    key: 'doorKnocking',
    title: 'Doors',
    icon: <RiDoorOpenLine />,
    fullWeeks: 3,
    partWeek: 0.3,
  },
  {
    key: 'calls',
    title: 'Calls',
    icon: <RiPhoneLine />,
    fullWeeks: 4,
    partWeek: 0.7,
  },
  {
    key: 'digital',
    title: 'Ads',
    icon: <FaBullhorn />,
    fullWeeks: 2,
    partWeek: 0,
  },
];

export default function ProgressSection(props) {
  const { contactGoals, weeksUntil, reportedVoterGoals, dateRange } = props;

  const { doorsOnTrack, callsOnTrack, digitalOnTrack } = calculateOnTrack({
    contactGoals,
    weeksUntil,
    reportedVoterGoals,
  });

  const { weeks, days } = weeksUntil;

  rows[0].onTrack = weeks < 0 || doorsOnTrack || weeks > 11;
  rows[1].onTrack = weeks < 0 || callsOnTrack || weeks > 11;
  rows[2].onTrack = weeks < 0 || digitalOnTrack || weeks > 11;

  const accumulated = calculateAccumulatedByWeek(contactGoals);
  const calculateReminder = (weekNum, key) => {
    const week = `week${weekNum}`;
    const reported = reportedVoterGoals[key];
    let reportedMinusPrevWeek;
    if (weekNum === 12) {
      reportedMinusPrevWeek = reported;
    } else {
      reportedMinusPrevWeek = reported - accumulated[`week${weekNum + 1}`][key];
    }
    const weekGoals = contactGoals[week][key];
    return reportedMinusPrevWeek > 0 ? reportedMinusPrevWeek / weekGoals : 0;
  };
  return (
    <section>
      <div className="mt-5 mb-3">
        <H3>Campaign Progress</H3>
      </div>
      <div className="bg-slate-200 rounded-3xl py-6 px-8 relative">
        <ProgressPill {...props} />
        <div className="flex justify-between items-center">
          {weeks > 0 ? (
            <div className="flex items-center">
              <H4>{weeks} weeks left</H4>
              <Body2 className="ml-3">{dateRange}</Body2>
            </div>
          ) : (
            <div>Election Recap</div>
          )}
        </div>
        <div className="grid grid-cols-12 mt-4 lg:mt-6">
          <div className=" col-span-1 text-[11px] text-indigo-200 font-sfpro hidden lg:block">
            Weeks left
          </div>
          <div className=" col-span-11  hidden lg:block">
            <div className="grid grid-cols-12 gap-1">
              {[...Array(12).keys()].map((index) => (
                <div
                  key={index}
                  className="col-span-1 relative text-[11px] text-indigo-200 font-sfpro"
                >
                  {weeks === 12 - index || (weeks === 0 && index === 11) ? (
                    <>
                      <strong>current</strong>
                      <div className="absolute w-full h-[116px] bg-lime-100 rounded-lg opacity-50 top-7 left-0"></div>
                    </>
                  ) : (
                    <>
                      {index === 11 ? (
                        <>Election</>
                      ) : (
                        <>
                          {12 - index}
                          {index === 0 ? '+' : ''} weeks
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
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
                      className={`relative overflow-hidden col-span-1 h-4 bg-gray-400 ${
                        index === 0 ? ' rounded-l-full' : ''
                      } ${index === 11 ? ' rounded-r-full' : ''}`}
                    >
                      {reportedVoterGoals[row.key] >
                      accumulated[`week${12 - index}`][row.key] ? (
                        <div
                          className={`absolute w-full h-full left-0 top-0 ${
                            row.onTrack ? 'bg-primary' : 'bg-red-400'
                          }`}
                        ></div>
                      ) : (
                        <>
                          {calculateReminder(12 - index, row.key) > 0 ? (
                            <div
                              className={`absolute h-full left-0 top-0 ${
                                row.onTrack ? 'bg-primary' : 'bg-red-400'
                              } rounded-r-full`}
                              style={{
                                width: `${
                                  calculateReminder(12 - index, row.key) * 100
                                }%`,
                              }}
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
