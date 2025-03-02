'use client';
import DashboardLayout from '../shared/DashboardLayout';

import { weekRangeFromDate, weeksTill } from 'helpers/dateHelper';
import { useCallback, useEffect, useState } from 'react';
import { calculateContactGoals } from './voterGoalsHelpers';
import {
  getCampaign,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions';
import ElectionOver from './ElectionOver';
import UpdateHistorySection from './UpdateHistorySection';
import EmptyState from './EmptyState';
import { updateUser } from 'helpers/userHelper';
import { useUser } from '@shared/hooks/useUser';
import { P2vSection } from './p2v/P2vSection';
import ContactMethodsSection from './contactMethods/ContactMethodsSection';
import PrimaryResultModal from './PrimaryResultModal';
import { fetchUserClientCampaign } from 'helpers/fetchUserClientCampaign';
import LoadingAnimation from '@shared/utils/LoadingAnimation';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

export async function createUpdateHistory(payload) {
  try {
    const resp = await clientFetch(
      apiRoutes.campaign.updateHistory.create,
      payload,
    );
    return resp.data;
  } catch (e) {
    console.log('error at createUpdateHistory.', e);
    return {};
  }
}

export async function fetchUpdateHistory() {
  try {
    const resp = await clientFetch(
      apiRoutes.campaign.updateHistory.list,
      undefined,
      { revalidate: 3 }, // 3 seconds cache to prevent multiple calls on load
    );
    return resp.data;
  } catch (e) {
    console.log('error at fetchUpdateHistory', e);
    return {};
  }
}

export default function DashboardPage({ pathname }) {
  const [_, setUser] = useUser();
  const [campaign, setCampaign] = useState(null);

  const { pathToVictory: p2vObject, goals, details } = campaign || {};
  const pathToVictory = p2vObject?.data || {};
  const { primaryElectionDate } = details || {};
  const [updateHistory, setUpdateHistory] = useState([]);
  const [primaryResultState, setPrimaryResultState] = useState({
    modalOpen: false,
    modalDismissed: false,
    primaryResult: undefined,
  });

  const officeName =
    details?.office?.toLowerCase() === 'other'
      ? details?.otherOffice
      : details?.office;

  const [state, setState] = useState({
    doorKnocking: 0,
    calls: 0,
    digital: 0,
    directMail: 0,
    digitalAds: 0,
    text: 0,
    events: 0,
  });

  const loadHistory = async () => {
    const updateHistory = await fetchUpdateHistory();
    setUpdateHistory(updateHistory || []);
  };

  // TODO: we're only having to do this, because we're caching the user object in the cookie and
  //  accessing it from there, instead of the source of truth, the DB.
  //  What we should be doing is fetching the user object from the server on each route change,
  //  and then we won't have to do this.
  const updateUserCookie = async () => {
    const updated = await updateUser();
    if (updated) {
      setUser(updated);
    }
  };

  useEffect(() => {
    if (campaign) return;

    loadCampaign();

    async function loadCampaign() {
      const campaign = await fetchUserClientCampaign();
      setCampaign(campaign);

      const reportedVoterGoals = campaign.data?.reportedVoterGoals;
      const storedPrimaryResult = campaign.details?.primaryResult;

      setState({
        doorKnocking: reportedVoterGoals?.doorKnocking || 0,
        calls: reportedVoterGoals?.calls || 0,
        digital: reportedVoterGoals?.digital || 0,
        directMail: reportedVoterGoals?.directMail || 0,
        digitalAds: reportedVoterGoals?.digitalAds || 0,
        text: reportedVoterGoals?.text || 0,
        events: reportedVoterGoals?.events || 0,
      });

      setPrimaryResultState({
        modalOpen: false,
        modalDismissed: false,
        primaryResult: storedPrimaryResult,
      });

      loadHistory();
      updateUserCookie();
    }
  }, []);

  const electionDate = details?.electionDate || goals?.electionDate;
  const { voterContactGoal, voteGoal } = pathToVictory || {};
  let resolvedContactGoal = voterContactGoal ?? voteGoal * 5;
  const now = new Date();
  let resolvedDate = electionDate;

  if (primaryElectionDate) {
    const primaryElectionDateObj = new Date(primaryElectionDate);
    const { modalOpen, primaryResult, modalDismissed } = primaryResultState;

    if (primaryElectionDateObj > now) {
      resolvedDate = primaryElectionDate;
    } else if (!primaryResult && !modalOpen && !modalDismissed) {
      // Primary date has passed, open up results modal
      setPrimaryResultState((state) => ({
        ...state,
        modalOpen: true,
      }));
    }
  }

  const weeksUntil = weeksTill(resolvedDate);

  const dateRange = weekRangeFromDate(resolvedDate, weeksUntil.weeks);
  const contactGoals = calculateContactGoals(resolvedContactGoal);

  const deleteHistoryCallBack = useCallback(async () => {
    const campaign = await getCampaign();
    if (campaign) {
      setState({
        doorKnocking: campaign?.data?.reportedVoterGoals?.doorKnocking || 0,
        calls: campaign?.data?.reportedVoterGoals?.calls || 0,
        digital: campaign?.data?.reportedVoterGoals?.digital || 0,
        directMail: campaign?.data?.reportedVoterGoals?.directMail || 0,
        digitalAds: campaign?.data?.reportedVoterGoals?.digitalAds || 0,
        text: campaign?.data?.reportedVoterGoals?.text || 0,
        events: campaign?.data?.reportedVoterGoals?.events || 0,
      });
    }

    await loadHistory();
  }, []);

  const updateCountCallback = useCallback(
    async (key, value, newAddition) => {
      const newState = {
        ...state,
        [key]: value,
      };
      setState(newState);

      await updateCampaign([
        { key: 'data.reportedVoterGoals', value: newState },
      ]);

      await createUpdateHistory({
        type: key,
        quantity: newAddition,
      });
      await loadHistory();
    },
    [state],
  );

  const primaryResultCloseCallback = useCallback((selectedResult) => {
    if (selectedResult) {
      // user selected their primary election result
      setPrimaryResultState((state) => ({
        ...state,
        modalOpen: false,
        primaryResult: selectedResult,
      }));

      //update local campaign object
      setCampaign((campaign) => ({
        ...campaign,
        details: {
          ...campaign.details,
          primaryResult: selectedResult,
        },
      }));
    } else {
      // user pressed Cancel to dismiss modal for now
      setPrimaryResultState({
        modalOpen: false,
        modalDismissed: true,
        primaryResult: undefined,
      });
    }
  }, []);

  const childProps = {
    campaign,
    pathname,
    contactGoals,
    weeksUntil,
    reportedVoterGoals: state,
    updateCountCallback,
    dateRange,
    updateHistory,
    pathToVictory,
    deleteHistoryCallBack,
  };

  return (
    <DashboardLayout {...childProps}>
      {campaign ? (
        <>
          <div>
            {contactGoals ? (
              <>
                {(weeksUntil.weeks < 0 &&
                  resolvedDate !== primaryElectionDate) ||
                primaryResultState.primaryResult === 'lost' ? (
                  <ElectionOver />
                ) : (
                  <>
                    <P2vSection {...childProps} />
                    <ContactMethodsSection {...childProps} />
                    <UpdateHistorySection {...childProps} />
                  </>
                )}
              </>
            ) : (
              <EmptyState campaign={campaign} />
            )}
          </div>
          {primaryElectionDate && (
            <PrimaryResultModal
              open={primaryResultState.modalOpen}
              onClose={primaryResultCloseCallback}
              electionDate={electionDate}
              officeName={officeName}
            />
          )}
        </>
      ) : (
        <LoadingAnimation title="Loading your dashboard" fullPage={false} />
      )}
    </DashboardLayout>
  );
}
