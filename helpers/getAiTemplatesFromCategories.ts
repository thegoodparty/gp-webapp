import { TASK_TYPES } from 'app/(candidate)/dashboard/shared/constants/tasks.const'

interface AiTemplate {
  key: string
  id?: string | number
  name?: string
  requiresQuestions?: string[]
}

interface TemplateCategory {
  name?: string
  templates?: AiTemplate[]
}

const AI_TEMPLATE_KEYS_BY_TASK_TYPE: Record<string, string[]> = {
  [TASK_TYPES.text]: [
    'sms1MonthUntilElection',
    'smsPersuasive',
    'smsElectionDay',
    'smsEarlyVoting',
    'smsGetOutTheVote',
  ],
  [TASK_TYPES.robocall]: [
    'robocall1MonthUntilElection',
    'robocallPersuasive',
    'robocallElectionDay',
  ],
  [TASK_TYPES.phoneBanking]: [
    'phoneBankingVoterId',
    'phoneBankingPersuasive',
    'phoneBankingGetOutTheVote',
  ],
  [TASK_TYPES.doorKnocking]: [
    'doorKnockingPersuasive',
    'doorKnockingVoterId',
    'doorKnockingGetOutTheVote',
  ],
  [TASK_TYPES.events]: ['meetGreetEventAssets'],
  [TASK_TYPES.socialMedia]: [
    'socialPostTopIssues',
    'socialPostCommonQuestions',
    'socialPostGetOutTheVote',
    'socialPostVoterId',
    'socialPostEventCalendar',
  ],
}

export const getAiTemplatesFromCategories = (
  categories: TemplateCategory[] = [],
  type: string = TASK_TYPES.text,
): AiTemplate[] =>
  categories
    ?.reduce<AiTemplate[]>(
      (aiTemplates, { templates = [] }) => [
        ...aiTemplates,
        ...templates.filter(({ key }) =>
          AI_TEMPLATE_KEYS_BY_TASK_TYPE[type]?.includes(key),
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
    ) || []

