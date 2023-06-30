'use client';
import DashboardLayout from '../shared/DashboardLayout';
import TitleSection from '../shared/TitleSection';
import ThisWeekSection from './ThisWeekSection';
import ProgressSection from './ProgressSection';
import { weeksTill } from 'helpers/dateHelper';
import { useState } from 'react';
import { calculateContactGoals } from './voterGoalsHelpers';
import H3 from '@shared/typography/H3';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';

export default function DashboardPage(props) {
  const { campaign } = props;
  const { pathToVictory, goals, reportedVoterGoals } = campaign;

  const [state, setState] = useState({
    doorKnocking: reportedVoterGoals?.doorKnocking || 0,
    calls: reportedVoterGoals?.calls || 0,
    digital: reportedVoterGoals?.digital || 0,
  });

  const { electionDate } = goals;
  const { voterContactGoal } = pathToVictory;
  const weeksUntil = weeksTill(electionDate);
  // const weeksUntil = { weeks: 10, days: 3 };
  const contactGoals = calculateContactGoals(voterContactGoal, weeksUntil);

  const updateCountCallback = async (key, value) => {
    const newState = {
      ...state,
      [key]: value,
    };
    setState(newState);
    await updateCampaign({
      ...campaign,
      reportedVoterGoals: newState,
    });
  };

  const childProps = {
    ...props,
    contactGoals,
    weeksUntil,
    reportedVoterGoals: state,
    updateCountCallback,
  };

  return (
    <DashboardLayout {...childProps}>
      <div className="max-w-[940px] mx-auto">
        <TitleSection
          title="Campaign Tracker"
          subtitle="Leveraging the data from your unique voter outreach figures, we've crafted a 12-week strategic blueprint tailored to optimize your campaign's success."
          imgWidth={128}
          imgHeight={120}
        />
        {contactGoals ? (
          <>
            <ThisWeekSection {...childProps} />
            <ProgressSection {...childProps} />
          </>
        ) : (
          <H3 className="mt-12">Waiting for voter contact goals input.</H3>
        )}
      </div>
    </DashboardLayout>
  );
}
