import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export async function scheduleVoterMessagingCampaign(state) {
  try {
    const api = gpApi.voterData.schedule;
    const payload = {
      ...state,
      date: state.schedule?.date,
      message: state.schedule?.message,
    };
    const formData = new FormData();

    for (const key in payload) {
      let value = payload[key];
      if (key === 'image' || value == undefined) continue;
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      formData.append(key, value);
    }

    // Skipper parser wants files after all other fields
    if (payload.image) {
      formData.append('image', payload.image);
    }

    return await gpFetch(api, formData, false, undefined, true);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}
