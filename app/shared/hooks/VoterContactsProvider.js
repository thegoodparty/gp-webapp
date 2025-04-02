import { useCampaign } from '@shared/hooks/useCampaign';
import { createContext, useCallback, useEffect, useState } from 'react';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';

export const getFilteredListOfReportedVoterContacts = (reportedVoterGoals) => ({
  doorKnocking: reportedVoterGoals?.doorKnocking || 0,
  calls: reportedVoterGoals?.calls || 0,
  digital: reportedVoterGoals?.digital || 0,
  directMail: reportedVoterGoals?.directMail || 0,
  digitalAds: reportedVoterGoals?.digitalAds || 0,
  text: reportedVoterGoals?.text || 0,
  events: reportedVoterGoals?.events || 0,
  robocall: reportedVoterGoals?.robocall || 0,
  phoneBanking: reportedVoterGoals?.phoneBanking || 0,
  socialMedia: reportedVoterGoals?.socialMedia || 0,
});

const INITIAL_VOTER_CONTACTS_STATE = {
  doorKnocking: 0,
  calls: 0,
  digital: 0,
  directMail: 0,
  digitalAds: 0,
  text: 0,
  events: 0,
  robocall: 0,
  phoneBanking: 0,
  socialMedia: 0,
};
export const VoterContactsContext = createContext([
  INITIAL_VOTER_CONTACTS_STATE,
  (_newValues) => ({}),
]);
export const VoterContactsProvider = ({ children }) => {
  const [campaign] = useCampaign();
  const { data: campaignData } = campaign || {};
  const { reportedVoterGoals } = campaignData || {};
  const [state, setState] = useState(INITIAL_VOTER_CONTACTS_STATE);

  useEffect(() => {
    if (reportedVoterGoals) {
      setState(getFilteredListOfReportedVoterContacts(reportedVoterGoals));
    }
  }, [reportedVoterGoals]);

  const updateState = useCallback(
    async (next) => {
      const newValues = typeof next === 'function' ? next(state) : next;
      console.log(`newValues =>`, newValues);
      await updateCampaign([
        { key: 'data.reportedVoterGoals', value: newValues },
      ]);

      setState(newValues);
    },
    [state],
  );

  return (
    <VoterContactsContext.Provider value={[state, updateState]}>
      {children}
    </VoterContactsContext.Provider>
  );
};
