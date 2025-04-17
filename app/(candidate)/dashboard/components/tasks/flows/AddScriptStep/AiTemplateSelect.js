import { ListSubheader, MenuItem, Select } from '@mui/material'
import { TEMPLATE_CATEGORY_ICONS } from 'app/(candidate)/dashboard/content/components/TemplatesList'

export const AiTemplateSelect = ({
  aiContentCategories = [],
  selected = '',
  onChange = (itemKey) => {},
}) => {
  const handleOnChange = (e) => {
    onChange(e.target.value)
  }

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
      {aiContentCategories.map((category) => [
        <ListSubheader key={category.name} className="flex items-center gap-2">
          {TEMPLATE_CATEGORY_ICONS[category.name]}
          {category.name}
        </ListSubheader>,
        ...category.templates
          .filter((template) => !template.taskOnly)
          .map((template) => (
            <MenuItem
              className={`${
                template.requiresQuestions
                  ? 'cursor-not-allowed opacity-70'
                  : ''
              }`}
              value={template.key}
              key={template.key}
            >
              {template.name}
            </MenuItem>
          )),
      ])}
    </Select>
  )
}
