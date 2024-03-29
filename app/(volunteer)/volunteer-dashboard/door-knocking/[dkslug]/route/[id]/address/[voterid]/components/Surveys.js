'use client';

import AwarenessSurvey from './AwarenessSurvey';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';

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
    return {};
  }
}

export default function Surveys(props) {
  const { voter, routeId } = props;
  const { type } = voter.dkCampaign;
  const [surveyData, setSurveyData] = useState({});

  const handleSave = async (key, value) => {
    const data = { ...surveyData, [key]: value };
    setSurveyData(data);
    await saveSurvey(data, routeId, voter.id);
  };
  return (
    <div>
      {type === 'Candidate Awareness' ? (
        <AwarenessSurvey {...props} handleSave={handleSave} />
      ) : null}
    </div>
  );
}
