'use client';
import DashboardLayout from '../shared/DashboardLayout';
import ThisWeekSection from './ThisWeekSection';
import ProgressSection from './ProgressSection';
import { weekRangeFromDate, weeksTill } from 'helpers/dateHelper';
import { useEffect, useState } from 'react';
import { calculateContactGoals } from './voterGoalsHelpers';
import {
  getCampaign,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import ElectionOver from './ElectionOver';
import MapSection from './MapSection';
import UpdateHistorySection from './UpdateHistorySection';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import EmptyState from './EmptyState';
import { updateUser } from 'helpers/userHelper';
import { useUser } from '@shared/hooks/useUser';
import AlertSection from './AlertSection';
import { P2vSection } from './p2v/P2vSection';

export async function createUpdateHistory(payload) {
  try {
    const api = gpApi.campaign.UpdateHistory.create;
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at createUpdateHistory.', e);
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
  const [user, setUser] = useUser();

  const { pathToVictory, goals, data, details, isPro } = campaign;
  const { reportedVoterGoals } = data || {};
  const { primaryElectionDate } = details || {};
  const [updateHistory, setUpdateHistory] = useState([]);

  const [state, setState] = useState({
    doorKnocking: reportedVoterGoals?.doorKnocking || 0,
    calls: reportedVoterGoals?.calls || 0,
    digital: reportedVoterGoals?.digital || 0,
  });

  const loadHistory = async () => {
    const res = await fetchUpdateHistory();
    setUpdateHistory(res.updateHistory);
  };

  // TODO: we're only having to do this, because we're caching the user object in the cookie and
  //  accessing it from there, instead of the source of truth, the DB.
  //  What we should be doing is fetching the user object from the server on each route change,
  //  and then we won't have to do this.
  const updateUserCookie = async () => {
    setUser((await updateUser()) || {});
  };

  useEffect(() => {
    if (campaign) {
      setState({
        doorKnocking: reportedVoterGoals?.doorKnocking || 0,
        calls: reportedVoterGoals?.calls || 0,
        digital: reportedVoterGoals?.digital || 0,
      });
      loadHistory();
      updateUserCookie();
    }
  }, [campaign]);

  const electionDate = details?.electionDate || goals?.electionDate;
  const { voterContactGoal, voteGoal, voterMap } = pathToVictory || {};
  let resolvedContactGoal = voterContactGoal ?? voteGoal * 5;
  const now = new Date();
  let resolvedDate = electionDate;
  if (primaryElectionDate && new Date(primaryElectionDate) > now) {
    resolvedDate = primaryElectionDate;
  }

  const weeksUntil = weeksTill(resolvedDate);

  const dateRange = weekRangeFromDate(resolvedDate, weeksUntil.weeks);
  const contactGoals = calculateContactGoals(resolvedContactGoal);

  const deleteHistoryCallBack = async () => {
    const resp = await getCampaign();
    if (resp && resp?.campaign) {
      const campaignObj = resp.campaign;
      setState({
        doorKnocking: campaignObj?.data?.reportedVoterGoals?.doorKnocking || 0,
        calls: campaignObj?.data?.reportedVoterGoals?.calls || 0,
        digital: campaignObj?.data?.reportedVoterGoals?.digital || 0,
      });
    }

    await loadHistory();
  };

  const updateCountCallback = async (key, value, newAddition) => {
    const newState = {
      ...state,
      [key]: value,
    };
    setState(newState);

    await updateCampaign([{ key: 'data.reportedVoterGoals', value: newState }]);

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
    pathToVictory,
    deleteHistoryCallBack,
  };

  console.log('childProps', childProps);
  console.log('state', state);

  return (
    <DashboardLayout {...childProps}>
      <div>
        {contactGoals ? (
          <>
            {weeksUntil.weeks < 0 && resolvedDate !== primaryElectionDate ? (
              <ElectionOver />
            ) : (
              <>
                <AlertSection campaign={campaign} />
                <P2vSection {...childProps} />

                <ThisWeekSection {...childProps} />
                {voterMap ? <MapSection map={voterMap} /> : null}
                <ProgressSection {...childProps} />
                <UpdateHistorySection {...childProps} />
              </>
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </DashboardLayout>
  );
}
