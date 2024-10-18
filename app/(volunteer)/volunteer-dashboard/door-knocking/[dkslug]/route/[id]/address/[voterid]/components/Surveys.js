'use client';

import AwarenessSurvey from './AwarenessSurvey';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';
import PersuasionSurvey from './PersuasionSurvey';
import GotvSurvey from './GotvSurvey';
import EducationSurvey from './EducationSurvey';
import { useSnackbar } from 'helpers/useSnackbar';

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
  const { errorSnackbar } = useSnackbar();
  const handleSave = async (key, value) => {
    const data = { ...surveyData, [key]: value };
    setSurveyData(data);
    const res = await saveSurvey(data, routeId, voter.id);
    if (!res) {
      errorSnackbar('Error saving. Please refresh and try again.');
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
