const HARD_CODED_AI_SMS_TEMPLATE_KEYS = ['smsElectionDay', 'smsGetOutTheVote']
export const getAiSmsTemplatesFromCategories = (categories = []) =>
  categories
    ?.reduce(
      (smsTemplates, { templates = [] }) => [
        ...smsTemplates,
        ...templates.filter(({ key }) =>
          HARD_CODED_AI_SMS_TEMPLATE_KEYS.includes(key),
        ),
      ],
      [],
    )
    .sort((a, b) =>
      a.requiresQuestions && !b.requiresQuestions
        ? 1
        : !a.requiresQuestions && b.requiresQuestions
        ? -1
        : 0,
    )
