interface Template {
  key: string
  name?: string
  id?: string | number
  requiresQuestions?: string[]
}

export type RequiresQuestionsMap = Partial<Record<string, string[]>>

export const setRequiresQuestionsOnTemplates = (
  templates: Template[] = [],
  requiresQuestionsMap: RequiresQuestionsMap = {},
): Template[] => {
  const requiresQuestionsKeys = Object.keys(requiresQuestionsMap)
  return templates.map((template) => ({
    ...template,
    ...(requiresQuestionsKeys.includes(template.key)
      ? { requiresQuestions: requiresQuestionsMap[template.key] }
      : {}),
  }))
}
