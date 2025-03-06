import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

export const writeCampaignCustomIssue = async (
  existingIndex = -1,
  title,
  position,
  customIssues = [],
) => {
  const newCustomIssue = {
    title,
    position,
  };

  if (existingIndex !== -1) {
    customIssues[existingIndex] = newCustomIssue;
  } else {
    customIssues.push(newCustomIssue);
  }
  await updateCampaign([{ key: 'details.customIssues', value: customIssues }], undefined, false);
  return customIssues;
};

export const deleteCustomIssue = async (index, customIssues = []) => {
  customIssues.splice(index, 1);
  await updateCampaign([{ key: 'details.customIssues', value: customIssues }], undefined, false);
  return [...customIssues];
};

export const filterIssues = (value = '', issues) => {
  return Array.isArray(issues)
    ? issues.filter(({ name = '' } = {}) =>
        name.toLowerCase().includes(value.toLowerCase()),
      )
    : issues;
};

export const saveCandidatePosition = async ({
  description,
  campaignId,
  positionId,
  topIssueId,
}) => {
  try {
    const payload = {
      id: campaignId,
      description,
      positionId,
      topIssueId,
      // TODO: remove order once the Sails "input" value for `order` is removed or made optional
      order: 0,
    };
    const resp = await clientFetch(
      apiRoutes.campaign.campaignPosition.create,
      payload,
    );
    return resp.data;
  } catch (e) {
    console.log('error at saveCandidatePosition', e);
    return false;
  }
};

export const deleteCandidatePosition = async (positionId, campaignId) => {
  try {
    const payload = {
      id: campaignId,
      positionId,
    };
    return await clientFetch(
      apiRoutes.campaign.campaignPosition.delete,
      payload,
    );
  } catch (e) {
    console.log('error at deleteCandidatePosition', e);
    return false;
  }
};

export async function updateCandidatePosition(
  positionId,
  description,
  campaignId,
) {
  try {
    const payload = {
      positionId,
      description,
      id: campaignId,
    };
    const resp = await clientFetch(
      apiRoutes.campaign.campaignPosition.update,
      payload,
    );
    return resp.data;
  } catch (e) {
    console.log('error at updateCandidatePosition', e);
    return false;
  }
}

export async function loadCandidatePosition(campaignId) {
  try {
    const payload = {
      id: campaignId,
    };
    const resp = await clientFetch(
      apiRoutes.campaign.campaignPosition.find,
      payload,
    );
    return resp.data;
  } catch (e) {
    console.log('error at loadCandidatePosition', e);
    return false;
  }
}

export const fetchIssues = async () => {
  const resp = clientFetch(apiRoutes.topIssue.list, undefined, {
    revalidate: 3600,
  });
  return resp.data;
};

export const findExistingCustomIssueIndex = (
  { details: { customIssues = [] } = {} } = {},
  issue,
  selectIssueCallback = (v) => {},
) => {
  const index = customIssues.findIndex(
    (customIssue) =>
      customIssue.title === issue?.title &&
      customIssue.position === issue?.position,
  );
  index !== -1 && selectIssueCallback('custom');
  return index;
};

export const handleDeleteCustomIssue = async (customIssue, campaign) => {
  const existingIndex = findExistingCustomIssueIndex(campaign, customIssue);
  const currentCustomIssues = campaign.details.customIssues || [];
  return existingIndex !== -1
    ? await deleteCustomIssue(existingIndex, currentCustomIssues)
    : [...currentCustomIssues];
};
