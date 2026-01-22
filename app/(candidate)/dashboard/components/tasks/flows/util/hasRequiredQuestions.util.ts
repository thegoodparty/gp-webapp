import { SmsTemplate } from '../AddScriptStep/SmsAiTemplateSelect'

export const hasRequiredQuestions = (template: SmsTemplate) =>
  (Array.isArray(template.requiresQuestions) &&
    template.requiresQuestions?.length) ||
  template.requiresQuestions
