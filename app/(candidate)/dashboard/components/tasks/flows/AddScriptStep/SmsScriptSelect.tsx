import { MenuItem, Select, SelectChangeEvent } from '@mui/material'

const DEFAULT_SMS_SCRIPTS = [
  'why',
  'aboutMe',
  'slogan',
  'policyPlatform',
  'communicationsStrategy',
  'messageBox',
  'mobilizing',
  'pathToVictory',
  'campaignPlanAttempts',
  'generationStatus',
]

interface ScriptOption {
  key: string
  name: string
  updatedAt: number
}

export const getSmsScriptSelectOptions = (aiContent?: PrismaJson.CampaignAiContent): ScriptOption[] => {
  let nonDefaultScripts = aiContent || {}
  DEFAULT_SMS_SCRIPTS.forEach((script) => {
    delete nonDefaultScripts[script]
  })
  let arr: ScriptOption[] = []
  for (const [key, value] of Object.entries(nonDefaultScripts)) {
    if (value && typeof value === 'object' && 'name' in value) {
      const typedValue: { name: string; updatedAt: number } = value
      arr.push({ key, ...typedValue })
    }
  }
  return arr.sort((a, b) => b.updatedAt - a.updatedAt)
}

interface SmsScriptSelectProps {
  aiContent?: PrismaJson.CampaignAiContent
  selectedKey: string | null
  onSelect?: (key: string) => void
}

export const SmsScriptSelect = ({
  aiContent,
  selectedKey,
  onSelect = () => {},
}: SmsScriptSelectProps): React.JSX.Element => {
  const handleOnChange = (e: SelectChangeEvent<string>) => {
    onSelect(e.target.value)
  }
  const options = getSmsScriptSelectOptions(aiContent)

  return (
    <Select
      value={selectedKey || ''}
      onChange={handleOnChange}
      displayEmpty
      fullWidth
    >
      <MenuItem disabled value="">
        Select a script
      </MenuItem>
      {options.map((option) => (
        <MenuItem key={option.key} value={option.key}>
          {option.name}
        </MenuItem>
      ))}
    </Select>
  )
}
