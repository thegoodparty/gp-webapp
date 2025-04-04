import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';
import { getUserFullName } from '@shared/utils/getUserFullName';

export async function deleteUpdateHistory(id) {
  const resp = await clientFetch(apiRoutes.campaign.updateHistory.delete, {
    id,
  });
  return resp.data;
}

export async function createUpdateHistory(payload) {
  const resp = await clientFetch(
    apiRoutes.campaign.updateHistory.create,
    payload,
  );
  return resp.data;
}

export const createIrresponsiblyMassagedHistoryItem = (historyItem, user) => ({
  ...historyItem,
  // TODO: We have to do this nonsense because this endpoint is still doing
  //  wonky nonsense w/ putting a poorly formed "user" object on it's response
  user: {
    id: user.id,
    name: getUserFullName(user),
    ...(user.avatar ? { avatar: user.avatar } : {}),
  },
});
