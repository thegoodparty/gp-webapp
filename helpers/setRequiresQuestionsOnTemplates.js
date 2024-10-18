export const setRequiresQuestionsOnTemplates = (
  templates = [],
  requiresQuestionsMap = {},
) => {
  const requiresQuestionsKeys = Object.keys(requiresQuestionsMap);
  return templates.map((template = {}) => ({
    ...template,
    ...(requiresQuestionsKeys.includes(template.key)
      ? { requiresQuestions: requiresQuestionsMap[template.key] }
      : {}),
  }));
};
