import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';

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
  return customIssues;
};
