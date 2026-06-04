import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@styleguide'
import { hasRequiredQuestions } from '../util/hasRequiredQuestions.util'
import { noop } from '@shared/utils/noop'

export interface SmsTemplate {
  key: string
  name?: string
  requiresQuestions?: string[]
}

interface SmsAiTemplateSelectProps {
  templates?: SmsTemplate[]
  selected?: string
  onChange?: (itemKey: string) => void
}

export const SmsAiTemplateSelect = ({
  templates = [],
  selected = '',
  onChange = noop,
}: SmsAiTemplateSelectProps): React.JSX.Element => {
  return (
    <Select value={selected || ''} onValueChange={onChange} required>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a Script Type *" />
      </SelectTrigger>
      <SelectContent>
        {templates.map((template) => (
          <SelectItem
            className={`${
              hasRequiredQuestions(template)
                ? 'cursor-not-allowed opacity-70'
                : ''
            }`}
            value={template.key}
            key={template.key}
          >
            {template.name || ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
