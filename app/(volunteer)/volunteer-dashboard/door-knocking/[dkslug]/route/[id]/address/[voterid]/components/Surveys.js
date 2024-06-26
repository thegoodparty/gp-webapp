'use client';

import AwarenessSurvey from './AwarenessSurvey';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import PersuasionSurvey from './PersuasionSurvey';
import GotvSurvey from './GotvSurvey';
import EducationSurvey from './EducationSurvey';

async function saveSurvey(data, routeId, voterId) {
  try {
    const api = gpApi.doorKnocking.survey.create;

    const payload = {
      data,
      routeId,
      voterId,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at acceptInvitation', e);
    return false;
  }
}

export default function Surveys(props) {
  const { voter, routeId, survey } = props;
  const { type } = voter.dkCampaign;
  const [surveyData, setSurveyData] = useState({});
  const snackbarState = useHookstate(globalSnackbarState);
  const handleSave = async (key, value) => {
    const data = { ...surveyData, [key]: value };
    setSurveyData(data);
    const res = await saveSurvey(data, routeId, voter.id);
    if (!res) {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error saving. Please refresh and try again.',
          isError: true,
        };
      });
    }
  };
  return (
    <div>
      {type === 'Candidate Awareness' ? (
        <AwarenessSurvey {...props} handleSave={handleSave} />
      ) : null}
      {type === 'Voter Issues/Candidate Issue Awareness' ? (
        <PersuasionSurvey {...props} handleSave={handleSave} />
      ) : null}
      {type === 'Get Out The Vote' ? (
        <GotvSurvey {...props} handleSave={handleSave} />
      ) : null}
      {type === 'Education Canvas' ? (
        <EducationSurvey {...props} handleSave={handleSave} />
      ) : null}
    </div>
  );
}
