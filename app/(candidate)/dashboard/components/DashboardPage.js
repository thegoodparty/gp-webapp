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
import UpdateHistorySection from './UpdateHistorySection';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export async function createUpdateHistory(payload) {
  try {
    console.log('update history create', payload);
    const api = gpApi.campaign.UpdateHistory.create;
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at createUpdateHistory', e);
    return {};
  }
}

export async function fetchUpdateHistory() {
  try {
    const api = gpApi.campaign.UpdateHistory.list;
    return await gpFetch(api, false, 3); // 3 seconds cache to prevent multiple calls on load
  } catch (e) {
    console.log('error at fetchUpdateHistory', e);
    return {};
  }
}

export default function DashboardPage(props) {
  const { campaign } = props;
  const { pathToVictory, goals, reportedVoterGoals } = campaign;
  const [updateHistory, setUpdateHistory] = useState([]);

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
      loadHistory();
    }
  }, [campaign]);

  const loadHistory = async () => {
    const res = await fetchUpdateHistory();
    setUpdateHistory(res.updateHistory);
  };

  const { electionDate } = goals;
  const { voterContactGoal, voteGoal, voterMap } = pathToVictory;
  let resolvedContactGoal = voterContactGoal ?? voteGoal * 5;
  const weeksUntil = weeksTill(electionDate);
  // const weeksUntil = { weeks: -1, days: 6 };

  const dateRange = weekRangeFromDate(electionDate, weeksUntil.weeks);
  const contactGoals = calculateContactGoals(resolvedContactGoal);

  const updateCountCallback = async (key, value, newAddition) => {
    const newState = {
      ...state,
      [key]: value,
    };
    setState(newState);
    await updateCampaign({
      ...campaign,
      reportedVoterGoals: newState,
    });

    await createUpdateHistory({
      type: key,
      quantity: newAddition,
    });
    await loadHistory();
  };

  const childProps = {
    ...props,
    contactGoals,
    weeksUntil,
    reportedVoterGoals: state,
    updateCountCallback,
    dateRange,
    updateHistory,
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
                <UpdateHistorySection {...childProps} />
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
