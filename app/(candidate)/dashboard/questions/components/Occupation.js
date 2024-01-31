'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';
import H1 from '@shared/typography/H1';

export default function Occupation({
  value,
  onChangeCallback,
  saveCallback,
  campaign,
  campaignKey,
}) {
  const handleSave = () => {
    if (!canSave()) return;
    const updated = {
      ...campaign,
      details: {
        ...campaign.details,
        [campaignKey]: value,
      },
    };
    saveCallback(updated);
  };
  const canSave = () => {
    return value !== '';
  };
  return (
    <div>
      <H1 className="mb-10">What is your current occupation?</H1>
      <div className="max-w-md m-auto">
        <TextField
          required
          label="Occupation"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={value}
          onChange={(e) => {
            onChangeCallback(campaignKey, e.target.value);
          }}
        />
        <div className="flex justify-center mt-10" onClick={handleSave}>
          <PrimaryButton className="mt-3" disabled={!canSave()}>
            Next
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
