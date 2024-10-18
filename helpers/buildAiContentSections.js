import { camelToSentence } from 'helpers/stringHelper';

export const AI_CONTENT_SUB_SECTION_KEY = 'aiContent';

export const buildAiContentSections = (campaign = {}, subSectionKey) => {
  let sectionsObj = campaign[subSectionKey] || {};

  let jobsProcessing = false;
  const statusObj = campaign[subSectionKey]?.generationStatus || {};
  for (const statusKey in statusObj) {
    if (statusObj[statusKey]['status'] === 'processing') {
      jobsProcessing = true;
      if (sectionsObj[statusKey] === undefined) {
        sectionsObj[statusKey] = {};
      }
      sectionsObj[statusKey]['key'] = statusKey;
      sectionsObj[statusKey]['name'] = camelToSentence(statusKey);
      sectionsObj[statusKey]['updatedAt'] = undefined;
      sectionsObj[statusKey]['status'] = 'processing';
    }
  }
  return [sectionsObj, jobsProcessing];
};
