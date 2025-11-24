interface Template {
  key: string
  requiresQuestions?: unknown[]
  [key: string]: unknown
}

interface RequiresQuestionsMap {
  [key: string]: unknown[]
}

export const setRequiresQuestionsOnTemplates = (
  templates: Template[] = [],
  requiresQuestionsMap: RequiresQuestionsMap = {},
): Template[] => {
  const requiresQuestionsKeys = Object.keys(requiresQuestionsMap)
  return templates.map((template: Template = {} as Template) => ({
    ...template,
    ...(requiresQuestionsKeys.includes(template.key)
      ? { requiresQuestions: requiresQuestionsMap[template.key] }
      : {}),
  }))
}

