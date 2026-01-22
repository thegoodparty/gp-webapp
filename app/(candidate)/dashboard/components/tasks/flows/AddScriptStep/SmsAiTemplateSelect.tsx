import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { hasRequiredQuestions } from '../util/hasRequiredQuestions.util'

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
  onChange = () => {},
}: SmsAiTemplateSelectProps): React.JSX.Element => {
  const handleOnChange = (e: SelectChangeEvent<string>) =>
    onChange(e.target.value)

  return (
    <Select
      value={selected || ''}
      displayEmpty
      fullWidth
      required
      variant="outlined"
      onChange={handleOnChange}
    >
      <MenuItem value="">
        Select a Script Type <span className="">*</span>
      </MenuItem>
      {templates.map((template) => (
        <MenuItem
          className={`${
            hasRequiredQuestions(template)
              ? 'cursor-not-allowed opacity-70'
              : ''
          }`}
          value={template.key}
          key={template.key}
        >
          {template.name || ''}
        </MenuItem>
      ))}
    </Select>
  )
}
