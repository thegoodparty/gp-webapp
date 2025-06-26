import { MenuItem, Select } from '@mui/material'

export const SmsAiTemplateSelect = ({
  templates = [],
  selected = '',
  onChange = (itemKey) => {},
}) => {
  const handleOnChange = (e) => onChange(e.target.value)
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
            template.requiresQuestions ? 'cursor-not-allowed opacity-70' : ''
          }`}
          value={template.key}
          key={template.key}
        >
          {template.name}
        </MenuItem>
      ))}
    </Select>
  )
}
