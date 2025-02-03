import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

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
  await updateCampaign([{ key: 'details.customIssues', value: customIssues }]);
  return customIssues;
};

export const deleteCustomIssue = async (index, customIssues = []) => {
  customIssues.splice(index, 1);
  await updateCampaign([{ key: 'details.customIssues', value: customIssues }]);
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
  campaignSlug,
  positionId,
  topIssueId,
}) => {
  try {
    const api = gpApi.campaign.campaignPosition.create;
    const payload = {
      description,
      campaignSlug,
      positionId,
      topIssueId,
      // TODO: remove order once the Sails "input" value for `order` is removed or made optional
      order: 0,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at saveCandidatePosition', e);
    return false;
  }
};

export const deleteCandidatePosition = async (id) => {
  try {
    const api = gpApi.campaign.campaignPosition.delete;
    const payload = {
      id,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at saveCandidatePosition', e);
    return false;
  }
};

export async function updateCandidatePosition(id, description) {
  try {
    const api = gpApi.campaign.campaignPosition.update;
    const payload = {
      id,
      description,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at saveCandidatePosition', e);
    return false;
  }
}

export async function loadCandidatePosition(slug) {
  try {
    const api = gpApi.campaign.campaignPosition.find;
    const payload = {
      slug,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at loadCandidatePosition', e);
    return false;
  }
}

export const fetchIssues = async () =>
  await gpFetch(gpApi.admin.topIssues.list, false, 3600);

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
