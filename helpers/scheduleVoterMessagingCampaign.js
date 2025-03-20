import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

export async function scheduleVoterMessagingCampaign(state) {
  try {
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

    // put file after all other fields
    if (payload.image) {
      formData.append('image', payload.image, payload.image.name);
    }

    const resp = await clientFetch(
      apiRoutes.voters.voterFile.schedule,
      formData,
    );

    return resp.data;
  } catch (e) {
    console.error('error', e);
    return false;
  }
}
