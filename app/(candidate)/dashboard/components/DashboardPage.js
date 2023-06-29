'use client';
import DashboardLayout from '../shared/DashboardLayout';
import TitleSection from '../shared/TitleSection';
import ThisWeekSection from './ThisWeekSection';
import ProgressSection from './ProgressSection';
import { weeksTill } from 'helpers/dateHelper';
import { useEffect, useState } from 'react';

export default function DashboardPage(props) {
  const [state, setState] = useState({
    doorKnocking: 0,
    calls: 0,
    digital: 0,
  });
  const { campaign } = props;
  useEffect(() => {
    const { reportedVoterGoals } = campaign;
    if (reportedVoterGoals) {
      setState(reportedVoterGoals);
    }
  }, []);
  const { pathToVictory, goals } = campaign;
  const { electionDate } = goals;
  const { voterContactGoal } = pathToVictory;
  // const weeksUntil = weeksTill(electionDate);
  const weeksUntil = { weeks: 10, days: 3 };
  const contactGoals = calculateContactGoals(voterContactGoal, weeksUntil);
  console.log('contactGoals', contactGoals);

  const childProps = {
    ...props,
    contactGoals,
    weeksUntil,
    reportedVoterGoals: state,
  };

  console.log('cihldprops', childProps);

  return (
    <DashboardLayout {...childProps}>
      <div className="max-w-[940px] mx-auto">
        <TitleSection
          title="Campaign Tracker"
          subtitle="Leveraging the data from your unique voter outreach figures, we've crafted a 12-week strategic blueprint tailored to optimize your campaign's success."
          imgWidth={128}
          imgHeight={120}
        />
        <ThisWeekSection {...childProps} />
        <ProgressSection {...childProps} />
      </div>
    </DashboardLayout>
  );
}

function calculateContactGoals(total, weeksUntil) {
  if (!total || !weeksUntil) {
    return false;
  }
  const totals = {
    week12: parseInt((total * 2.7) / 100, 10),
    week11: parseInt((total * 4.05) / 100, 10),
    week10: parseInt((total * 4.05) / 100, 10),
    week9: parseInt((total * 5.41) / 100, 10),
    week8: parseInt((total * 8.11) / 100, 10),
    week7: parseInt((total * 8.11) / 100, 10),
    week6: parseInt((total * 9.46) / 100, 10),
    week5: parseInt((total * 9.46) / 100, 10),
    week4: parseInt((total * 10.81) / 100, 10),
    week3: parseInt((total * 10.81) / 100, 10),
    week2: parseInt((total * 13.51) / 100, 10),
    week1: parseInt((total * 13.51) / 100, 10),
  };

  const totalGoals = {};
  Object.keys(totals).forEach((week) => {
    totalGoals[week] = {
      total: totals[week],
      doorKnocking: parseInt(totals[week] * 0.2),
      calls: parseInt(totals[week] * 0.35),
      digital: parseInt(totals[week] * 0.45),
    };
  });

  return totalGoals;
}
