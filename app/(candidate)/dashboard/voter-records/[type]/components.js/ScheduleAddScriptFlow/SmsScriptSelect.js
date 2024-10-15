import { Select } from '@mui/material';

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
];

export const getSmsScriptSelectOptions = (aiContent) => {
  let nonDefaultScripts = aiContent || {};
  // filter default scripts nonDefaultScripts is an object
  DEFAULT_SMS_SCRIPTS.forEach((script) => {
    delete nonDefaultScripts[script];
  });
  let arr = [];
  for (const [key, value] of Object.entries(nonDefaultScripts)) {
    arr.push({ key, ...value });
  }
  return arr.sort((a, b) => b.updatedAt - a.updatedAt);
};

export const SmsScriptSelect = ({
  aiContent,
  selectedKey,
  onSelect = (key) => {},
}) => {
  const handleOnChange = (e) => {
    onSelect(e.currentTarget.value);
  };
  return (
    <Select
      native
      value={selectedKey || ''}
      fullWidth
      required
      variant="outlined"
      onChange={handleOnChange}
    >
      <option value="">Select a Script</option>
      {Boolean(aiContent) &&
        getSmsScriptSelectOptions(aiContent).map((op) => (
          <option value={op.key} key={op.key}>
            {op.name}
          </option>
        ))}
    </Select>
  );
};
