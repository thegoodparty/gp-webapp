const HARD_CODED_AI_SMS_TEMPLATE_KEYS = ['smsElectionDay', 'smsGetOutTheVote']

const sortTemplatesByQuestions = (a, b) =>
  a.requiresQuestions && !b.requiresQuestions
    ? 1
    : !a.requiresQuestions && b.requiresQuestions
    ? -1
    : 0

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
    .sort(sortTemplatesByQuestions)

export const getAiTemplatesFromCategories = (categories = []) =>
  categories
    .map((category) => {
      console.log('category', category)
      return category.templates
    })
    .flat()
    .sort(sortTemplatesByQuestions)
