'use client';
import DashboardLayout from '../shared/DashboardLayout';
import TitleSection from '../shared/TitleSection';
import ThisWeekSection from './ThisWeekSection';
import ProgressSection from './ProgressSection';
import { weekRangeFromDate, weeksTill } from 'helpers/dateHelper';
import { useEffect, useState } from 'react';
import { calculateContactGoals } from './voterGoalsHelpers';
import H3 from '@shared/typography/H3';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import ElectionOver from './ElectionOver';
import MapSection from './MapSection';

export default function DashboardPage(props) {
  const { campaign } = props;
  const { pathToVictory, goals, reportedVoterGoals } = campaign;

  const [state, setState] = useState({
    doorKnocking: reportedVoterGoals?.doorKnocking || 0,
    calls: reportedVoterGoals?.calls || 0,
    digital: reportedVoterGoals?.digital || 0,
  });

  useEffect(() => {
    if (campaign) {
      setState({
        doorKnocking: reportedVoterGoals?.doorKnocking || 0,
        calls: reportedVoterGoals?.calls || 0,
        digital: reportedVoterGoals?.digital || 0,
      });
    }
  }, [campaign]);

  const { electionDate } = goals;
  const { voterContactGoal, voteGoal, voterMap } = pathToVictory;
  let resolvedContactGoal = voterContactGoal ?? voteGoal * 5;
  const weeksUntil = weeksTill(electionDate);
  // const weeksUntil = { weeks: -1, days: 6 };

  const dateRange = weekRangeFromDate(electionDate, weeksUntil.weeks);
  const contactGoals = calculateContactGoals(resolvedContactGoal);

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
    dateRange,
  };

  return (
    <DashboardLayout {...childProps}>
      <div className="max-w-[940px] mx-auto">
        {contactGoals ? (
          <>
            {weeksUntil.weeks < 0 ? (
              <ElectionOver />
            ) : (
              <>
                <TitleSection
                  title="Campaign Tracker"
                  subtitle="Leveraging the data from your unique voter outreach figures, we've crafted a 12-week strategic blueprint tailored to optimize your campaign's success."
                  imgWidth={128}
                  imgHeight={120}
                />
                <ThisWeekSection {...childProps} />
                {voterMap ? <MapSection map={voterMap} /> : null}
                <ProgressSection {...childProps} />
              </>
            )}
          </>
        ) : (
          <H3 className="mt-12">Waiting for voter contact goals input.</H3>
        )}
      </div>
    </DashboardLayout>
  );
}
