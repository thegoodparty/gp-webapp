import H1 from '@shared/typography/H1'
import { TASK_TYPES, LEGACY_TASK_TYPES } from '../../constants/tasks.const'
import Button from '@shared/buttons/Button'

const INSTRUCTIONS_BY_TYPE = {
  [TASK_TYPES.texting]: [
    'Select target audience',
    'Develop your script',
    'Attach your image',
    'Schedule texting campaign',
    'Our team will reach out with next steps',
  ],
  [TASK_TYPES.phoneBanking]: [
    'Select target audience',
    'Develop your message',
    'Download materials',
    'Learn more about running a phone banking campaign',
    'Make calls',
  ],
  [TASK_TYPES.doorKnocking]: [
    'Select target audience',
    'Develop your message',
    'Download materials',
    'Learn more about running a door knocking campaign',
    'Go knock on doors',
  ],
  [TASK_TYPES.socialMedia]: ['Develop your message', 'Post to social media'],
  [TASK_TYPES.robocall]: [
    'Select target audience',
    'Develop your script',
    'Schedule robocall',
    'Our team will reach out with next steps',
  ],
}

// TODO: remove these once we replace old dashboard view with new task flow
// legacy type "sms" uses the same instructions as "texting"
INSTRUCTIONS_BY_TYPE[LEGACY_TASK_TYPES.sms] =
  INSTRUCTIONS_BY_TYPE[TASK_TYPES.texting]
// legacy type "telemarketing" uses the same instructions as "robocall"
INSTRUCTIONS_BY_TYPE[LEGACY_TASK_TYPES.telemarketing] =
  INSTRUCTIONS_BY_TYPE[TASK_TYPES.robocall]

export default function InstructionsStep({
  type,
  nextCallback,
  closeCallback,
}) {
  const instructions = INSTRUCTIONS_BY_TYPE[type] || []

  return (
    <div className="p-4 min-w-[500px]">
      <H1 className="text-center">How this works</H1>
      <ol className="mt-6 mb-8 list-decimal list-inside leading-6">
        {instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
      <div className="flex justify-between">
        <Button size="large" color="neutral" onClick={closeCallback}>
          Cancel
        </Button>
        <Button size="large" color="secondary" onClick={nextCallback}>
          Next
        </Button>
      </div>
    </div>
  )
}
